import { StatusCode } from "../util/consts/status.code";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class DuplitcateError extends BaseCustomError {
  constructor(message: string) {
    super(message, StatusCode.Conflict);
    Object.setPrototypeOf(this,DuplitcateError.prototype)
  }
  getStatusCode(): number {
      return this.statusCode;
  }
  serializeErrorOutput(): SerializedErrorOutput {
      return {errors:[{message:this.message}]}
  }
}
