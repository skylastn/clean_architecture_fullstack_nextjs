// import { ApiResponse } from "@/domain/be/model/response/api_response";
import { ApiResponse } from "@/domain/model/database/api_response";
import { UserService } from "@/infrastructure/services/be/user_service";
import withAuth from "@/shared/utils/auth_middleware";
// import withAuth from "@/shared/utils/auth_middleware";
// import { withAuth } from "@/middleware";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  await withAuth(req, res, async () => {
    // const user = req.user; // Access the injected user here
    switch (req.method) {
      case "GET":
        try {
          const { page, perPage } = req.query;
          const result = await UserService.getListUser(
            parseInt((page as string) || "1"),
            parseInt((perPage as string) || "10")
          );
          return ApiResponse.pagination(res, result.data, {
            currentPage: parseInt((page as string) || "1"),
            perPage: parseInt((perPage as string) || "10"),
            total: result.total,
          });
        } catch (err) {
          return ApiResponse.failed(res, null, ApiResponse.catchError(err));
        }
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
