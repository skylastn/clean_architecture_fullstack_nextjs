import {
  LoadingProvider,
  useLoading,
} from "@/shared/component/elements/loading_context";
import { AppShell } from "@/shared/component/layouts/AppShell";
import "@/shared/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
function GlobalLoader() {
  const { loading } = useLoading();
  return loading ? (
    <div className="floating-loader">
      <div className="spinner"></div>
    </div>
  ) : null;
}
export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoadingProvider>
      {/* Harus di luar agar global */}
      <Toaster position="top-right" />
      <GlobalLoader />
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </LoadingProvider>
  );
}
