import { BaseResponse } from "./base_response";
import { ProductRuleResponse } from "./product_rule_response";

export namespace UserResponse {
  export type Response = BaseResponse<Data>;
  export interface Data {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    point?: number;
    verification_code?: null;
    email_verified_at?: Date;
    photo?: null;
    created_at?: Date;
    updated_at?: Date;
    isAdmin?: boolean;
    isVerified?: boolean;
    product_rule?: ProductRuleResponse.Data[];
  }
}
