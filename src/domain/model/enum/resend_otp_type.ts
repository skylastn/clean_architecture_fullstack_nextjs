export enum ResendOTPType {
  email_verification = "email_verification",
  forgot_password = "forgot_password",
}
export namespace ResendOTPType {
  export function from(value: string): ResendOTPType {
    switch (value) {
      case "email_verification":
        return ResendOTPType.email_verification;
      case "forgot_password":
        return ResendOTPType.forgot_password;
      default:
        return ResendOTPType.email_verification;
    }
  }
  export function subject(type: ResendOTPType): string {
    switch (type) {
      case ResendOTPType.email_verification:
        return "Verifikasi Email";
      case ResendOTPType.forgot_password:
        return "Forgot Password";
      default:
        return "Verifikasi Email";
    }
  }
}
