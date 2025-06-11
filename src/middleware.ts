import { NextRequest, NextResponse } from "next/server";
import { LocalDataSource } from "./infrastructure/data_source/fe/local_data_source";

export async function middleware(request: NextRequest) {
  const token = LocalDataSource.getToken;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ status: false, message: "Unauthorized", data: null }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/welcome",
  ],
};
