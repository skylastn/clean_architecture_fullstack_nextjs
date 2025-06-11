import { NextApiResponse } from "next";

export const ApiResponse = {
  success(res: NextApiResponse, data: any = null, message = "Success") {
    return res.status(200).json({ status: true, message, data });
  },
  pagination(
    res: NextApiResponse,
    data: any = null,
    pagination: PaginationResponse,
    message = "Success"
  ) {
    return res.status(200).json({
      status: true,
      total: pagination.total,
      perPage: pagination.perPage,
      currentPage: pagination.currentPage,
      message,
      data,
    });
  },
  failed(res: NextApiResponse, data: any = null, message = "Error") {
    return res.status(400).json({ status: false, message, data });
  },
  unauthorized(
    res: NextApiResponse,
    data: any = null,
    message = "Unauthorized"
  ) {
    return res.status(401).json({ status: false, message, data });
  },
  catchError(error: any): string {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    } else {
      console.error("Unknown error:", error);
      return "Unknown error";
    }
  },
};

export interface PaginationResponse {
  total: number;
  perPage: number;
  currentPage: number;
}
