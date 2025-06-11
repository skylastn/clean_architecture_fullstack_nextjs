import { AuthService } from "@/infrastructure/services/be/auth_service";
import { UserService } from "@/infrastructure/services/be/user_service";
import { NextApiRequest, NextApiResponse } from "next";

export async function withAuth(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse,
  next: () => void
) {
  const token = req.headers["token"];
  if (!token) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }

  const accessToken = await AuthService.getAccessToken(token as string);

  if (!accessToken) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }

  req.user = accessToken.user;
  next();
}

export default withAuth;
