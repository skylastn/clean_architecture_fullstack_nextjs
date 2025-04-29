import { BaseResponse } from "./base_response";
import { ProductResponse } from "./product_response";

export namespace ProductRuleResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    id?: number;
    user_id?: number;
    product_code?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: null;
    expired_at?: Date | null;
    product?: ProductResponse.Data;
  }
}
