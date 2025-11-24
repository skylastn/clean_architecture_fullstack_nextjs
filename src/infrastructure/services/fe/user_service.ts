import { UserResponse } from "@/domain/model/response/user_response";
import { UrlPath } from "@/shared/constant/url_path";
import { NetworkUtils } from "@/shared/network/network";

export class UserService {
  static async me(): Promise<UserResponse.Data | undefined> {
    const response = await NetworkUtils(UrlPath.ME, "GET");
    if (response.status == true) {
      return UserResponse.Convert.toResponse(JSON.stringify(response.data))
        .data;
    }
    throw new Error(response.message);
  }
}
