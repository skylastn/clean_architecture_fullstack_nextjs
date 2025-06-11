import { ResponseModel } from "@/domain/response_model";
import { LocalDataSource } from "@/infrastructure/data_source/fe/local_data_source";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL as string;

export const NetworkUtils = async (
  path: string,
  method: string,
  params?: any,
  data?: any,
  url?: string,
  responseType: any = "json"
): Promise<ResponseModel> => {
  let endpoint = (url ?? baseUrl) + "/" + path;
  const config: any = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    responseType: responseType,
  };
  const accessToken = LocalDataSource.getToken();
  // if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  if (accessToken) config.headers["token"] = `${accessToken}`;

  let res = await axios({
    url: endpoint,
    method,
    data,
    params,
    withCredentials: true,
    ...config,
  });
  if (res.status === 200) {
    return ResponseModel.from(res);
  }
  var result = new ResponseModel();
  result.message = res.data.message ?? res.statusText ?? "Error";
  result.status = false;
  result.data = res.data;
  return result;
};
