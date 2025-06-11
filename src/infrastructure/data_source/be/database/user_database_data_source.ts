import { PersonalAccessTokenResponse } from "@/domain/model/response/personal_access_token_response";
import { UserResponse } from "@/domain/model/response/user_response";
import db from "@/shared/connection/db";
import sign from "jwt-encode";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { env } from "process";

export namespace UserDatabaseDataSource {
  const JWT_SECRET = env.JWT_SECRET ?? "";
  export async function getListUser(
    page: number = 1,
    perPage: number = 10
  ): Promise<UserResponse.Data[]> {
    const offset = (page - 1) * perPage;
    const query = await db.user.findMany({
      take: perPage,
      skip: offset,
      orderBy: { created_at: "asc" },
    });

    const result = UserResponse.Convert.toDataArray(query);
    return result;
  }

  export async function getCountUser(): Promise<number> {
    const result = await db.user.count();
    return result;
  }

  export async function getDetailUserById(
    id: string
  ): Promise<UserResponse.Data | null> {
    const user = await db.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return user;
    }
    const result = UserResponse.Convert.toData(user);
    return result;
  }

  export async function getDetailUserByEmailOrPhone(
    email: string,
    phone: string
  ): Promise<UserResponse.Data | null> {
    const user = await db.user.findFirst({
      where: { OR: [{ email: email }, { phone: phone }] },
    });
    if (!user) {
      return user;
    }
    const result = UserResponse.Convert.toData(user);
    return result;
  }

  export async function getDetailUserByEmail(
    email: string
  ): Promise<UserResponse.Data | null> {
    const user = await db.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return user;
    }
    const result = UserResponse.Convert.toData(user);
    return result;
  }

  export async function getDetailUserByPhone(
    phone: string
  ): Promise<UserResponse.Data | null> {
    const user = await db.user.findUnique({
      where: { phone: phone },
    });
    if (!user) {
      return user;
    }
    const result = UserResponse.Convert.toData(user);
    return result;
  }

  export async function createUser(
    name: string,
    phone: string,
    email: string,
    password: string
  ): Promise<UserResponse.Data> {
    const user = await db.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          name: name,
          phone: phone,
          email: email,
          password: password,
        },
      });
    });
    const result = UserResponse.Convert.toData(user);
    return result;
  }
  export async function updateVerificationUser(
    id: string,
    isEmail: boolean,
    isVerified: boolean,
    code: string | null
  ): Promise<boolean> {
    var data = {};
    if (isEmail) {
      data = {
        email_verified_at: isVerified ? new Date() : null,
        email_verification_code: code,
      };
    } else {
      data = {
        phone_verified_at: isVerified ? new Date() : null,
        phone_verification_code: code,
      };
    }
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: id },
        data: data,
      });
    });

    return true;
  }

  export async function updateOtherVerification(
    id: string,
    code: string | null
  ): Promise<boolean> {
    var data = {
      other_verified_code: code,
    };
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: id },
        data: data,
      });
    });
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
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: id },
        data: {
          password: password,
        },
      });
    });

    return true;
  }

  export async function generateToken(
    user_id: string,
    name: string,
    req: NextRequest | NextApiRequest
  ): Promise<PersonalAccessTokenResponse.Data> {
    // Buat JWT di sini
    // const token = await getToken({ req: req, secret: JWT_SECRET, raw: true });
    const token = sign(
      { user_id: user_id, date: new Date().toISOString() },
      JWT_SECRET
    );
    console.log("token : ", token);

    if (!token) {
      throw new Error("Creating Token Error");
    }
    const tokenWithUser = await db.$transaction(async (tx) => {
      return await tx.personalAccessToken.create({
        data: { token: token, user_id: user_id, name: name },
      });
    });

    if (!tokenWithUser) {
      return tokenWithUser;
    }
    const result = PersonalAccessTokenResponse.Convert.toData(tokenWithUser);
    return result;
  }

  export async function getAccessToken(
    token: string
  ): Promise<PersonalAccessTokenResponse.Data | null> {
    const tokenWithUser = await db.personalAccessToken.findUnique({
      where: { token: token },
      include: { user: true },
    });
    if (!tokenWithUser) {
      return tokenWithUser;
    }
    const result = PersonalAccessTokenResponse.Convert.toData(tokenWithUser);
    return result;
  }
}
