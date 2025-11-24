import { ResponseModel } from "@/domain/response_model";
import { LocalDataSource } from "@/infrastructure/data_source/fe/local_data_source";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL as string;

export const NetworkUtils = async <T>(
  path: string,
  method: string,
  params?: Record<string, unknown>,
  requestData?: Record<string, unknown> | FormData | string | ArrayBuffer,
  url?: string,
  responseType: "json" | "arraybuffer" | "blob" | "stream" | "text" = "json"
): Promise<ResponseModel<T>> => {
  const endpoint = (url ?? baseUrl) + "/" + path;
  console.log("Calling endpoint:", endpoint);

  const config: AxiosRequestConfig = {
    method: method, // Explicitly set method here for AxiosRequestConfig
    url: endpoint, // Explicitly set url here for AxiosRequestConfig
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    responseType: responseType,
    params: params, // Add params to config
    data: requestData, // Add requestData (body) to config
    withCredentials: true, // This is now properly typed by AxiosRequestConfig
  };

  const accessToken = LocalDataSource.getToken();
  if (accessToken) {
    config.headers = {
      // Ensure headers exist before modifying
      ...(config.headers as Record<string, string>), // Cast back to Record<string, string> for type safety
      token: `${accessToken}`,
    };
  }

  let res: AxiosResponse;
  try {
    // Pass the entire config object directly to axios
    res = await axios(config); // <<< Simplified axios call

    if (res.status === 200) {
      return ResponseModel.from<T>(res);
    }

    const result = new ResponseModel<T>();
    result.message = res.data?.message ?? res.statusText ?? "Error";
    result.status = false;
    result.data = res.data;
    return result;
  } catch (error: unknown) {
    const result = new ResponseModel<T>();
    result.status = false;

    if (axios.isAxiosError(error)) {
      result.message =
        error.response?.data?.message || error.message || "Network Error";
      result.data = error.response?.data;
      if (error.response?.status === 401) {
        // Handle unauthorized logic here, e.g., redirect
      }
    } else if (error instanceof Error) {
      result.message = error.message;
    } else {
      result.message = "An unexpected error occurred.";
    }

    return result;
  }
};
