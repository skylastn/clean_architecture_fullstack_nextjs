import { UrlPath } from "@/shared/constant/url_path";
import { NetworkUtils } from "@/shared/network/network";
import { LoginResponse } from "../../domain/model/response/login_response";
import { LocalDataSource } from "@/infrastructure/data_source/local_data_source";
import { LoginRequest } from "../../domain/model/request/login_request";

export class AuthService {
  static async login(
    loginRequest: LoginRequest.Data
  ): Promise<LoginResponse.Response> {
    // await NetworkUtils("sanctum/csrf-cookie", 'GET');
    var response = await NetworkUtils(
      UrlPath.LOGIN,
      "POST",
      null,
      loginRequest
    //   LoginRequest.Convert.dataToJson(loginRequest)
    );
    // console.log(JSON.stringify(response.data));
    var result = LoginResponse.Convert.toData(JSON.stringify(response));
    if (result.status) {
      LocalDataSource.saveToken(result.data?.token ?? "");
    }
    return result;
  }
}
