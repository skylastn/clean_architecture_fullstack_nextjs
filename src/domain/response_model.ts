// src/domain/response_model.ts
import { AxiosResponse } from "axios";

export class ResponseModel<T> {
  status?: boolean;
  message?: string;
  total?: number;
  perPage?: number;
  currentPage?: number;
  data?: T;

  static from<U>(
    res: AxiosResponse<{
      // Specify the structure of res.data
      status?: boolean;
      message?: string;
      total?: number;
      perPage?: number;
      currentPage?: number;
      data?: U; // data inside res.data is expected to be U
    }>
  ): ResponseModel<U> {
    // No need for the second 'any' here, it's about the config
    return {
      status: res.data.status ?? res.status === 200,
      message: res.data.message ?? res.statusText ?? "Success",
      total: res.data.total,
      perPage: res.data.perPage,
      currentPage: res.data.currentPage,
      data: res.data.data as U,
    };
  }
}
