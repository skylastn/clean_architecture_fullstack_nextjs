import { ApiResponse } from "@/domain/model/database/api_response";
import { AuthService } from "@/infrastructure/services/be/auth_service";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { name, phone, email, password } = req.body;
      try {
        var result = await AuthService.register(name, phone, email, password);
        return ApiResponse.success(res, result);
      } catch (err) {
        return ApiResponse.failed(res, null, ApiResponse.catchError(err));
      }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
