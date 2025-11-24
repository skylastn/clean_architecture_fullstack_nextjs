import { ResendOTPType } from "@/domain/model/enum/resend_otp_type";
import { PersonalAccessTokenResponse } from "@/domain/model/response/personal_access_token_response";
import { UserResponse } from "@/domain/model/response/user_response";
import { UserDatabaseDataSource } from "@/infrastructure/data_source/be/database/user_database_data_source";
import { UserMailDataSource } from "@/infrastructure/data_source/be/mail/user_mail_data_source";
import { Helper } from "@/shared/utils/helper";
import bcrypt from "bcrypt";

export namespace AuthService {
  export async function register(
    name: string,
    phone: string,
    email: string,
    password: string
  ): Promise<UserResponse.Data> {
    const user = await UserDatabaseDataSource.getDetailUserByEmailOrPhone(
      email,
      phone
    );
    if (user) {
      throw new Error("User Already Exists");
    }
    const hash = await bcrypt.hash(password, Helper.saltRounds);
    const result = await UserDatabaseDataSource.createUser(
      name,
      phone,
      email,
      hash
    );
    const verificationCode = Helper.generateRandomString(6).toUpperCase();
    //Update Email Verification
    await UserDatabaseDataSource.updateVerificationUser(
      result.id ?? "",
      true,
      false,
      verificationCode
    );
    UserMailDataSource.sendMail(
      email,
      ResendOTPType.subject(ResendOTPType.email_verification),
      "Verification Code : " + verificationCode
    );
    return result;
  }
  export async function login(
    email: string,
    password: string
  ): Promise<PersonalAccessTokenResponse.Data> {
    const isEmail: boolean = Helper.isEmail(email);
    let user: UserResponse.Data | null;
    if (isEmail) {
      user = await UserDatabaseDataSource.getDetailUserByEmail(email);
    } else {
      user = await UserDatabaseDataSource.getDetailUserByPhone(email);
    }
    if (user == null) {
      throw new Error("User Not Found");
    }
    // console.log("user : ", user);
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password ?? ""
    );
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }
    if (user.email_verified_at == null) {
      throw new Error("Email Not Verified");
    }
    return await UserDatabaseDataSource.generateToken(
      user.id ?? "",
      user.name ?? ""
    );
  }

  export async function resendOtp(
    type: ResendOTPType,
    username: string
  ): Promise<UserResponse.Data> {
    const isEmail: boolean = Helper.isEmail(username);
    let result: UserResponse.Data | null;
    if (isEmail) {
      result = await UserDatabaseDataSource.getDetailUserByEmail(username);
    } else {
      throw new Error("Phone Not Supported Yet");
      result = await UserDatabaseDataSource.getDetailUserByPhone(username);
    }
    if (result == null) {
      throw new Error("User Not Found");
    }
    const verificationCode = Helper.generateRandomString(6).toUpperCase();
    switch (type) {
      case ResendOTPType.email_verification:
        await UserDatabaseDataSource.updateVerificationUser(
          result.id ?? "",
          true,
          false,
          verificationCode
        );
        break;

      default:
        break;
    }
    await UserDatabaseDataSource.updateVerificationUser(
      result.id ?? "",
      true,
      false,
      verificationCode
    );
    if (isEmail) {
      UserMailDataSource.sendMail(
        username,
        ResendOTPType.subject(type),
        "Verification Code : " + verificationCode
      );
    }
    return result;
  }

  export async function verifyOtp(
    type: ResendOTPType,
    username: string,
    code: string,
    password?: string,
    repeat_password?: string
  ): Promise<UserResponse.Data> {
    const isEmail: boolean = Helper.isEmail(username);
    let result: UserResponse.Data | null;
    if (isEmail) {
      result = await UserDatabaseDataSource.getDetailUserByEmail(username);
    } else {
      throw new Error("Phone Not Supported Yet");
      result = await UserDatabaseDataSource.getDetailUserByPhone(username);
    }
    if (result == null) {
      throw new Error("User Not Found");
    }

    switch (type) {
      case ResendOTPType.email_verification:
        let isEmailVerificationCodeValid: boolean = false;
        // console.log("result : ", result);
        if (isEmail) {
          isEmailVerificationCodeValid = result.email_verification_code == code;
        } else {
          isEmailVerificationCodeValid = result.phone_verification_code == code;
        }
        if (!isEmailVerificationCodeValid) {
          throw new Error("Invalid verification code");
        }
        await UserDatabaseDataSource.updateVerificationUser(
          result.id ?? "",
          isEmail,
          true,
          null
        );
        break;
      case ResendOTPType.forgot_password:
        const isForgotPasswordCodeValid: boolean =
          result.other_verification_code == code;
        if (!isForgotPasswordCodeValid) {
          throw new Error("Invalid verification code");
        }
        if (!password || !repeat_password) {
          throw new Error("Please enter password");
        }
        if (password !== repeat_password) {
          throw new Error("Password not match");
        }
        await UserDatabaseDataSource.changePassword(
          result.id ?? "",
          await bcrypt.hash(password, Helper.saltRounds),
          true
        );
      default:
        break;
    }
    return result;
  }

  export async function getAccessToken(
    token: string
  ): Promise<PersonalAccessTokenResponse.Data | null> {
    return await UserDatabaseDataSource.getAccessToken(token);
  }
}
