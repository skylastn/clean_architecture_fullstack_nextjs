export interface BaseResponse<T> {
    status?: boolean;
    message?: string;
    data?: T;
}
