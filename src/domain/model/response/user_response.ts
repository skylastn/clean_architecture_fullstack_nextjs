import { User } from "@prisma/client";
import { BaseResponse } from "./base_response";

export namespace UserResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    id?: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    password?: string | null;
    other_verified_code?: string | null;
    email_verified_code?: string | null;
    phone_verified_code?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    email_verified_at?: Date | null;
    phone_verified_at?: Date | null;
  }

  export class Convert {
    public static toData(content: User): Data {
      return {
        id: content.id,
        name: content.name,
        email: content.email,
        phone: content.phone,
        password: content.password,
        other_verified_code: content.other_verification_code,
        email_verified_code: content.email_verification_code,
        phone_verified_code: content.phone_verification_code,
        created_at: content.created_at,
        updated_at: content.updated_at,
        email_verified_at: content.email_verified_at,
        phone_verified_at: content.phone_verified_at,
      };
    }

    public static toDataArray(prismaUsers: User[]): Data[] {
      return prismaUsers.map((user) => Convert.toData(user));
    }

    public static toResponse(json: string): Response {
      return JSON.parse(json);
    }

    public static responseToJson(value: Response): string {
      return JSON.stringify(value);
    }
  }
}
