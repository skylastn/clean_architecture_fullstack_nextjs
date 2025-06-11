export namespace LocalDataSource {
  export const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  export const getItem = (key: string) => {
    return localStorage.getItem(key);
  };

  export const saveToken = (token: string) => {
    setItem("token", token);
  };
  export const getToken = () => {
    return getItem("token");
  };
}
