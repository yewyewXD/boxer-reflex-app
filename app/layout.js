import "./globals.css";
import { Inter } from "next/font/google";
import "react-rangeslider/lib/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Boxer Reflex App",
  description: "An reflex training app for boxers, made by yewyewXD.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
