import { ApiResponse } from "@/domain/model/database/api_response";
import { ResendOTPType } from "@/domain/model/enum/resend_otp_type";
import { AuthService } from "@/infrastructure/services/be/auth_service";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { type, username } = req.body;

      try {
        await AuthService.resendOtp(ResendOTPType.from(type), username);
        return ApiResponse.success(res, [], "Success Sending Otp");
      } catch (err) {
        return ApiResponse.failed(res, null, ApiResponse.catchError(err));
      }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
