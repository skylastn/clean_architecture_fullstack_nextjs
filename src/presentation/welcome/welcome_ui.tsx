import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import werehouse from "../../../public/auth/auth.png";
import logo from "../../../public/auth/logo_lugu.png";

const WelcomeUI = () => {
    const router = useRouter();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Image src={werehouse} alt="auth illustration" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 100 }}>
                <Image src={logo} style={{ width: 50, height: 50 }} alt="logo" />
                <h3>Selamat datang</h3>
            </div>
        </div>
    );
};

export default WelcomeUI;
