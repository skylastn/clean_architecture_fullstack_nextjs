import { PersonalAccessTokenResponse } from "@/domain/model/response/personal_access_token_response";
import { UserResponse } from "@/domain/model/response/user_response";
import { UserDatabaseDataSource } from "@/infrastructure/data_source/be/database/user_database_data_source";

export namespace UserService {
  export async function getListUser(
    page: number = 1,
    perPage: number = 10
  ): Promise<{
    data: UserResponse.Data[];
    total: number;
  }> {
    var result = await UserDatabaseDataSource.getListUser(page, perPage);
    var count = await UserDatabaseDataSource.getCountUser();
    return { data: result, total: count };
  }

  export async function getDetailUserById(
    id: string
  ): Promise<UserResponse.Data | null> {
    const user = await UserDatabaseDataSource.getDetailUserById(id);
    if (!user) return null;
    return user;
  }
}
