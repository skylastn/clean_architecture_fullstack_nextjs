export namespace LoginRequest {
  export interface Data {
    username?: string;
    password?: string;
  }

  // Converts JSON strings to/from your types
  export class Convert {
    public static toData(json: string): Data {
      return JSON.parse(json);
    }

    public static dataToJson(value: Data): string {
      return JSON.stringify(value);
    }
  }
}
