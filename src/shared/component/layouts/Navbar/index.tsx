"use client";
import { useEffect, useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import logo_lugu from "../../../../../public/auth/logo_lugu.png";
import Image from "next/image";
import styles from "@/shared/component/layouts/Navbar/Navbar.module.css";
import { useRouter } from "next/navigation";
import { LocalDataSource } from "@/infrastructure/data_source/fe/local_data_source";
import { UserService } from "@/infrastructure/services/fe/user_service";
import { UserResponse } from "@/domain/model/response/user_response";

export default function Navbar() {
  const [user, setUser] = useState<UserResponse.Data | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [isMenuOpen, setOpen] = useState(false);
  const HandleMenu = () => setOpen(!open);

  const getUser = async () => {
    try {
      var result = await UserService.me();
      if (!result) {
        setUser(null);
        return;
      }
      setUser(result);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  useEffect(() => {
    const token = LocalDataSource.getToken();
    if (!token) return;
    setToken(token);
    getUser();
  }, []);

  const handleLogout = () => {
    LocalDataSource.saveToken("");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className="flex items-center">
        <Image
          src={logo_lugu}
          width={50}
          height={50}
          alt="logo"
          className="ml-4"
        />
      </div>

      <div className="hidden md:flex gap-4 mx-4 p-2">
        {token ? (
          <button
            onClick={handleLogout}
            className="text-2xl font-semibold text-orange-700 hover:text-red-800 transition duration-200 ease-in-out"
          >
            Logout
          </button>
        ) : (
          <a
            href="/auth/login"
            className="text-2xl font-semibold text-orange-700 hover:text-red-800 transition duration-200 ease-in-out"
          >
            Login
          </a>
        )}
      </div>

      <div className="md:hidden flex items-center justify-between w-full px-4">
        <div style={{ paddingLeft: "10px" }}>
          <p className="font-bold text-sm">Hello {user?.name || "SJM"}</p>
          <p className="text-gray-500 font-semibold text-sm">
            {user?.id || "Sales "}
          </p>
        </div>

        <button onClick={HandleMenu}>
          {isMenuOpen ? (
            <CloseOutlined style={{ fontSize: "24px", color: "black" }} />
          ) : (
            <MenuOutlined style={{ fontSize: "24px", color: "black" }} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.popup}>
          {token ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className={styles.popupItem}
            >
              Logout
            </button>
          ) : (
            <a
              href="/auth/login"
              onClick={() => setOpen(false)}
              className={styles.popupItem}
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
