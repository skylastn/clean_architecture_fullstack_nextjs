import { BaseResponse } from "./base_response";
import { UserResponse } from "./user_response";

//   const data = Convert.toData(json);
export namespace LoginResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    token?: string;
    user?: UserResponse.Data;
  }

  // Converts JSON strings to/from your types
  export class Convert {
    public static toData(json: string): Response {
      return JSON.parse(json);
    }

    public static dataToJson(value: Response): string {
      return JSON.stringify(value);
    }
  }
}
