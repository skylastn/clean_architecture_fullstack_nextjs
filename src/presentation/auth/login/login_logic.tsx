import { LoginRequest } from "@/domain/model/request/login_request";
import { AuthService } from "@/domain/services/auth_service";
import { useLoading } from "@/shared/component/elements/loading_context";
import delay from "@/shared/utils/delay";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export const useLoginLogic = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading } = useLoading();

  const handlerLogin = async () => {
    setLoading(true);
    try {
      var result = await AuthService.login({
        username: username,
        password: password,
      });
      await delay(2);
      if (!result.status) {
        throw new Error(result.message ?? "");
      }
      toast.success("Berhasil Login!");
      router.push("/product");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(String(error));
      }
    } finally {
      setLoading(false);
    }
  };
  return { handlerLogin, setUsername, setPassword };
};
