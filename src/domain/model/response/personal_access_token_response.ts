import { BaseResponse } from "./base_response";
import { UserResponse } from "./user_response";

export namespace PersonalAccessTokenResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    id?: string | null;
    user_id?: string | null;
    token?: string | null;
    name?: string | null;
    user?: UserResponse.Data | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }

  export class Convert {
    public static toData(content: any): Data {
      return {
        id: content.id,
        user_id: content.user_id,
        token: content.token,
        name: content.name,
        user: content.user_id_join
          ? UserResponse.Convert.toData({
              id: content.user_id_join,
              name: content.user_name_join,
              email: content.user_email_join,
              phone: content.user_phone_join,
              password: content.user_password_join,
              other_verification_code: content.user_other_verification_code,
              email_verification_code: content.user_email_verification_code,
              phone_verification_code: content.user_phone_verification_code,
              created_at: content.user_created_at_join,
              updated_at: content.user_updated_at_join,
              email_verified_at: content.user_email_verified_at,
              phone_verified_at: content.user_phone_verified_at,
            })
          : null,
        createdAt: content.created_at,
        updatedAt: content.updated_at,
      };
    }

    public static toDataArray(dbRows: any[]): Data[] {
      return dbRows.map((row) => Convert.toData(row));
    }

    public static toResponse(json: string): Response {
      return JSON.parse(json);
    }

    public static responseToJson(value: Response): string {
      return JSON.stringify(value);
    }
  }
}
