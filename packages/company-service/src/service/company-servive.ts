// import { ICompanyDocument } from "../database/model/company.repository.model";
import {
  // DeleteCompanyRequest,
  companycreateschema,
  companyupdateschema,
} from "../database/repository/@types/company.repo.type";
import CompanyRepo from "../database/repository/company.repository";
import APIError from "../error/api-error";
import DuplitcateError from "../error/duplicate-error";

class CompanyService {
  private companyrepo: CompanyRepo;
  constructor() {
    this.companyrepo = new CompanyRepo();
  }

  async Create(companydetail: companycreateschema) {
    try {
      const company = await this.companyrepo.Create(companydetail);
      return company;
    } catch (error) {
      if (error instanceof DuplitcateError) {
        throw new Error("Unable to create user");
      }
    }
  }

  async FindById({ id }: { id: string }) {
    try {
      return await this.companyrepo.FindById({ id });
    } catch (error) {
      // console.log(error);
      throw new APIError("Unable to get user with this ID");
    }
  }

  async Delete({ id }: { id: string }) {
    try {
      return await this.companyrepo.Delete({ id });
    } catch (error: any) {
      console.log("error on service layer", error);
      throw new APIError("Unable to delete User profile");
    }
  }

  async update({ id, update }: { id: string; update: companyupdateschema }) {
    try {
      return await this.companyrepo.Update({ id, update });
    } catch (error) {
      // console.log(error);
      throw new APIError("Unable to update User profile!");
    }
  }
}
export default CompanyService;
