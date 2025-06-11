import { PersonalAccessToken, User } from "@prisma/client";
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
    public static toData(
      content: PersonalAccessToken & { user?: User | null }
    ): Data {
      return {
        id: content.id,
        user_id: content.user_id,
        token: content.token,
        name: content.name,
        user:
          content.user == null
            ? null
            : UserResponse.Convert.toData(content.user),
        createdAt: content.created_at,
        updatedAt: content.updated_at,
      };
    }

    public static toDataArray(content: PersonalAccessToken[]): Data[] {
      return content.map((user) => Convert.toData(user));
    }

    public static toResponse(json: string): Response {
      return JSON.parse(json);
    }

    public static responseToJson(value: Response): string {
      return JSON.stringify(value);
    }
  }
}
