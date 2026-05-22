import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axieme MGA Platform",
  description: "Configurable InsurTech platform for MGA and underwriting agency operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>;
}
