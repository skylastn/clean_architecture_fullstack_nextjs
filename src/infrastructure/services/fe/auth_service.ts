import { UrlPath } from "@/shared/constant/url_path";
import { NetworkUtils } from "@/shared/network/network";
// import { LoginResponse } from "../../domain/fe/model/response/login_response";
import { LocalDataSource } from "@/infrastructure/data_source/fe/local_data_source";
import { LoginRequest } from "@/domain/model/request/login_request";
import { LoginResponse } from "@/domain/model/response/login_response";
// import { LoginRequest } from "../../domain/fe/model/request/login_request";

export class AuthService {
  static async login(
    loginRequest: LoginRequest.Data
  ): Promise<LoginResponse.Response> {
    const response = await NetworkUtils(
      UrlPath.LOGIN,
      "POST",
      {},
      { ...loginRequest }
    );
    const result = LoginResponse.Convert.toData(JSON.stringify(response));
    if (result.status) {
      LocalDataSource.saveToken(result.data?.token ?? "");
    }
    return result;
  }
}
