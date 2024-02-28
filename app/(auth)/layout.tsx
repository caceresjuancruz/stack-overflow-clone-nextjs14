import { LayoutProps } from "@/types";

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="background-main-gradient flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  );
}
