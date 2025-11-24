import { PersonalAccessTokenResponse } from "@/domain/model/response/personal_access_token_response"; // Import PersonalAccessTokenResponse namespace
import { UserResponse } from "@/domain/model/response/user_response";
import { DB } from "@/shared/connection/db_injection";
import { env } from "process";
import sign from "jwt-encode";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export namespace UserDatabaseDataSource {
  const JWT_SECRET = env.JWT_SECRET ?? "";
  const tableName: string = "`users`";
  const personalAccessTokenTableName: string = "`personal_access_tokens`";

  export async function getListUser(
    page: number = 1,
    perPage: number = 10
  ): Promise<UserResponse.Data[]> {
    const offset = (page - 1) * perPage;
    const users = await DB.select<RowDataPacket[]>(
      `SELECT * FROM ${tableName} ORDER BY created_at ASC LIMIT ? OFFSET ?`,
      [perPage, offset]
    );
    return UserResponse.Convert.toDataArray(users);
  }

  export async function getCountUser(): Promise<number> {
    const [rows]: any = await DB.query(
      `SELECT COUNT(*) as total FROM ${tableName}`
    );
    return rows[0].total;
  }

  export async function getDetailUserById(
    id: string
  ): Promise<UserResponse.Data | null> {
    const [user]: any = await DB.query(
      `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`,
      [id]
    );
    return user ? UserResponse.Convert.toData(user) : null;
  }

  export async function getDetailUserByEmailOrPhone(
    email: string,
    phone: string
  ): Promise<UserResponse.Data | null> {
    const [user]: any = await DB.query(
      `SELECT * FROM ${tableName} WHERE email = ? OR phone = ? LIMIT 1`,
      [email, phone]
    );
    return user ? UserResponse.Convert.toData(user) : null;
  }

  export async function getDetailUserByEmail(
    email: string
  ): Promise<UserResponse.Data | null> {
    const [user]: any = await DB.query(
      `SELECT * FROM ${tableName} WHERE email = ? LIMIT 1`,
      [email]
    );
    return user ? UserResponse.Convert.toData(user) : null;
  }

  export async function getDetailUserByPhone(
    phone: string
  ): Promise<UserResponse.Data | null> {
    const [user]: any = await DB.query(
      `SELECT * FROM ${tableName} WHERE phone = ? LIMIT 1`,
      [phone]
    );
    return user ? UserResponse.Convert.toData(user) : null;
  }

  export async function createUser(
    name: string,
    phone: string,
    email: string,
    password: string
  ): Promise<UserResponse.Data> {
    const result = await DB.insert(tableName, {
      id: DB.uuid(),
      name: name,
      phone: phone,
      email: email,
      password: password,
      created_at: DB.now(),
      updated_at: DB.now(),
      other_verification_code: null,
      email_verification_code: null,
      phone_verification_code: null,
      email_verified_at: null,
      phone_verified_at: null,
    });

    const newUserId = (result as ResultSetHeader).insertId;
    const [insertedUser]: any = await DB.query(
      `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`,
      [newUserId]
    );

    return UserResponse.Convert.toData(insertedUser);
  }

  export async function updateVerificationUser(
    id: string,
    isEmail: boolean,
    isVerified: boolean,
    code: string | null
  ): Promise<boolean> {
    const updateData: Record<string, any> = {
      updated_at: DB.now(),
    };

    if (isEmail) {
      updateData.email_verified_at = isVerified ? DB.now() : null;
      updateData.email_verification_code = code;
    } else {
      updateData.phone_verified_at = isVerified ? DB.now() : null;
      updateData.phone_verification_code = code;
    }

    await DB.update(tableName, updateData, `id = ?`, [id]);
    return true;
  }

  export async function updateOtherVerification(
    id: string,
    code: string | null
  ): Promise<boolean> {
    const data = {
      other_verified_code: code,
      updated_at: DB.now(),
    };
    await DB.update(tableName, data, `id = ?`, [id]);
    return true;
  }

  export async function changePassword(
    id: string,
    password: string,
    isUpdateVerification: boolean
  ): Promise<boolean> {
    if (isUpdateVerification) {
      await updateOtherVerification(id, null);
    }

    await DB.update(
      tableName,
      {
        password: password,
        updated_at: DB.now(),
      },
      `id = ?`,
      [id]
    );

    return true;
  }

  export async function generateToken(
    user_id: string,
    name: string
  ): Promise<PersonalAccessTokenResponse.Data> {
    const token = sign(
      { user_id: user_id, date: new Date().toISOString() },
      JWT_SECRET
    );

    if (!token) {
      throw new Error("Creating Token Error");
    }

    const result = await DB.insert(personalAccessTokenTableName, {
      id: DB.uuid(),
      token: token,
      user_id: user_id,
      name: name,
      created_at: DB.now(),
      updated_at: DB.now(),
      last_used_at: null,
      expires_at: null,
    });

    const newAccessTokenId = (result as ResultSetHeader).insertId;
    const [insertedToken]: any = await DB.query(
      `SELECT * FROM ${personalAccessTokenTableName} WHERE id = ? LIMIT 1`,
      [newAccessTokenId]
    );

    // Use the existing PersonalAccessTokenResponse.Convert.toData
    return PersonalAccessTokenResponse.Convert.toData(insertedToken);
  }

  export async function getAccessToken(
    token: string
  ): Promise<PersonalAccessTokenResponse.Data | null> {
    const [tokenWithUser]: any = await DB.query(
      `SELECT a.*,
              u.id AS user_id_join,
              u.name AS user_name_join,
              u.email AS user_email_join,
              u.phone AS user_phone_join,
              u.password AS user_password_join,
              u.other_verification_code,
              u.email_verification_code,
              u.phone_verification_code,
              u.created_at AS user_created_at_join,
              u.updated_at AS user_updated_at_join,
              u.email_verified_at,
              u.phone_verified_at
       FROM ${personalAccessTokenTableName} a
       LEFT JOIN ${tableName} u ON a.user_id = u.id
       WHERE a.token = ? LIMIT 1`,
      [token]
    );

    if (!tokenWithUser) {
      return null;
    }

    return PersonalAccessTokenResponse.Convert.toData(tokenWithUser);
  }
}
