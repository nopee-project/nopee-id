import type { ReactNode } from "react";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {children}

      <SiteFooter />
    </div>
  );
}
