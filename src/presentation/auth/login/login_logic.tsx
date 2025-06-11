import { AuthService } from "@/infrastructure/services/fe/auth_service";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export const useLoginLogic = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlerLogin = async () => {
    if (!username || !password) {
      toast.error("Username dan password tidak boleh kosong");
      return;
    }

    try {
      const response = await AuthService.login({
        username,
        password,
      });

      if (response.status == true) {
        toast.success("Login berhasil!");
        router.push("/welcome");
      } else {
        console.log(response.message);
        toast.error(response.message || "Terjadi kesalahan saat login.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login.");
      console.log(error);
    }
  };

  return { username, setUsername, password, setPassword, handlerLogin };
};
