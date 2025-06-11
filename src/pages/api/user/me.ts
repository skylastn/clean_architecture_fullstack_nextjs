import { ApiResponse } from "@/domain/model/database/api_response";
import withAuth from "@/shared/utils/auth_middleware";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  await withAuth(req, res, async () => {
    const user = req.user;
    switch (req.method) {
      case "GET":
        try {
          return ApiResponse.success(res, user);
        } catch (err) {
          return ApiResponse.failed(res, null, ApiResponse.catchError(err));
        }
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
