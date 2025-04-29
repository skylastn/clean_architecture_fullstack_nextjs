export namespace ProductResponse {
  export interface Data {
    id?: number;
    code?: string;
    name?: string;
    detail?: string;
    price?: number;
    point?: number;
    qty?: null;
    duration?: number | null;
    cover_path?: null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
    coverUrl?: string;
  }
}
