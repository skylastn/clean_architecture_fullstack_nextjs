import { useRouter } from "next/router";
import Navbar from "../Navbar";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const router = useRouter();
  const onlyDashboard = router.pathname.startsWith("/dashboard");

  return (
    <main>
      {onlyDashboard && <Navbar />}
      {children}
    </main>
  );
};
