import UserRepository from "../database/repository/user.repository";
import {
  ValidatePassword,
  generatePassword,
  generateSignature,
} from "../utils/jwt";
import { UserSignUpResult, UserSignupParams } from "./@types/user.service.type";
import { AccountVerificationRepository } from "../database/repository/account-verication-repository";
import { generateEmailVerificationToken } from "../utils/account-verification";
import accountVerificationModel from "../database/model/account-verify";
import { publishDirectMessage } from "../queues/auth.producer";
import { authChannel } from "../server";
import { UsersignInSchemType } from "../schema/@types/user";
import DuplicateError from "../errors/duplicate-error";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import axios from "axios";

class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  // NOTE: THIS METHOD WILL USE BY SIGNUP WITH EMAIL & OAUTH
  async Create(userDetails: UserSignupParams): Promise<UserSignUpResult> {
    try {
      // Step 1
      const hashedPassword =
        userDetails.password && (await generatePassword(userDetails.password));
      let newUserParams = { ...userDetails };
      if (hashedPassword) {
        newUserParams = { ...newUserParams, password: hashedPassword };
      }

      // Step 2
      const authUser = await this.userRepo.CreateUser(newUserParams);
      return authUser;
    } catch (error: unknown) {
      // Step 3
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: userDetails.email,
        });

        if (!existedUser?.isVerified) {
          // Resend the token
          const token =
            await this.accountVerificationRepo.FindVerificationTokenById({
              id: existedUser!._id as string,
            });

          if (!token) {
            logger.error(`UserService Create() method error: token not found!`);
            throw new APIError(
              `Something went wrong!`,
              StatusCode.InternalServerError
            );
          }

          const messageDetails = {
            receiverEmail: existedUser!.email,
            verifyLink: `${token.emailVerificationToken}`,
            template: "verifyEmail",
          };

          // Publish To Notification Service
          await publishDirectMessage(
            authChannel,
            "email-notification",
            "auth-email",
            JSON.stringify(messageDetails),
            "Verify email message has been sent to notification service"
          );

          throw new APIError(
            "A user with this email already exists. Verification email resent.",
            StatusCode.Conflict
          );
        } else {
          throw new APIError(
            "A user with this email already exists. Please login.",
            StatusCode.Conflict
          );
        }
      }
      throw error;
    }
  }

  // Generate and Save Verification Token
  async SaveVerificationToken({ userId }: { userId: string }) {
    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();
      // Step 2
      const accountVerification = new accountVerificationModel({
        userId,
        emailVerificationToken,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }
  async VerifyEmailToken({ token }: { token: string }) {
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });

    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }

    // Find the user associated with this token
    const user = await this.userRepo.FindUserById({
      id: isTokenExist.userId.toString(),
    });
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }
    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Remove the verification token
    // await this.accountVerificationRepo.DeleteVerificationToken({ token });
    console.log("User", user);

    await this.SentRequestBaseOnRole(user);
    return user;
  }

  async SentRequestBaseOnRole(user: any): Promise<void> {
    try {
      if (user.role === "user") {
        const response = await axios.post(
          "http://profile-service:4003/v1/users",
          {
            authid: user._id.toString(),
            FullName: user.username,
            email: user.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      } else if (user.role === "employer") {
        const response = await axios.post(
          "http://company-service:4004/v1/company",
          {
            userId: user._id.toString(),
            companyName: user.username,
            contactEmail: user.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      logger.error(`Error sending request based on role: ${error}`);
      throw new APIError(
        "Failed to send request to the appropriate service",
        StatusCode.InternalServerError
      );
    }
  }

  // Login method
  async Login(UserDetails: UsersignInSchemType) {
    const user = await this.userRepo.FindUser({ email: UserDetails.email });

    if (!user) {
      throw new APIError("User does not exist", StatusCode.NotFound);
    }

    const isPwdCorrect = await ValidatePassword({
      enterpassword: UserDetails.password,
      savedPassword: user.password as string,
    });

    if (!isPwdCorrect) {
      throw new APIError(
        "Email or Password is incorrect",
        StatusCode.BadRequest
      );
    }

    const token = await generateSignature({UserID: user._id});
    return token;
  }

  async FindUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepo.FindUser({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async UpdateUser({ id, update }: { id: string; update: object }) {
    try {
      const user = await this.userRepo.FindUserById({ id });
      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updatedUser = await this.userRepo.UpdateUserById({ id, update });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
