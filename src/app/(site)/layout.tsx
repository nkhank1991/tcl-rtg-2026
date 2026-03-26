import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SplashScreen } from "@/components/layout/splash-screen";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SplashScreen />
      <Header />
      <div className="flex-1">{children}</div>
      <BottomNav />
    </>
  );
}
