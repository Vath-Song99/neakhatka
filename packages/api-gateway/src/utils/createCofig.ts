import dotenv from "dotenv";
// npm install dotenv

import APIError from "../error/api-error";
import path from 'path'

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });
  // "RABBITMQ_ENDPOINT",
  // Validate essential configuration   
  const requiredConfig = ["NODE_ENV", "PORT", "LOG_LEVEL" , "CLIENT_URL", "COOKIE_SECRET_KEY_ONE", "COOKIE_SECRET_KEY_TWO", "AUTH_SERVICE_URL", "USER_SERVICE_URL","COMPANY_SERVICE","NOTIFICATION_SERVICE_URL"];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    // rabbitMQ: process.env.RABBITMQ_ENDPOINT,
    clientUrl: process.env.CLIENT_URL,
    cookieSecretKeyOne: process.env.COOKIE_SECRET_KEY_ONE,
    cookieSecretKeyTwo: process.env.COOKIE_SECRET_KEY_TWO,
    authServiceUrl: process.env.AUTH_SERVICE_URL,
    userServiceUrl: process.env.USER_SERVICE_URL,
    companyserviceurl: process.env.COMPANY_SERVICE,
    notificationUrl: process.env.NOTIFICATION_SERVICE_URL
  };
}

const getConfig = (currentEnv: string = 'development') => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
