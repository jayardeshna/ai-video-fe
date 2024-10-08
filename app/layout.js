import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ai-avtar",
  description: "Generated AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}
      >
        {children}
      </body>
    </html>
  );
}
