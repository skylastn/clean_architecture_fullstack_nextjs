import { BaseResponse } from "./base_response";

export namespace UserResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    id?: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    password?: string | null;
    other_verification_code?: string | null;
    email_verification_code?: string | null;
    phone_verification_code?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    email_verified_at?: Date | null;
    phone_verified_at?: Date | null;
  }

  export class Convert {
    // IMPORTANT: Change 'User' to 'any' or 'RowDataPacket' (if imported)
    // to reflect that it's now a raw database row object.
    public static toData(content: any): Data { // Changed from `content: User`
      return {
        id: content.id,
        name: content.name,
        email: content.email,
        phone: content.phone,
        password: content.password,
        other_verification_code: content.other_verification_code,
        email_verification_code: content.email_verification_code,
        phone_verification_code: content.phone_verification_code,
        created_at: content.created_at,
        updated_at: content.updated_at,
        email_verified_at: content.email_verified_at,
        phone_verified_at: content.phone_verified_at,
      };
    }

    // This method will now correctly map an array of 'any' objects
    public static toDataArray(dbRows: any[]): Data[] { // Changed from `prismaUsers: User[]`
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