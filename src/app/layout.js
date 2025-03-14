import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const fontMont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mont",
});

export const metadata = {
  title: "FlowLoved Some",
  description: "Made with Love by Nadir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fontPoppins.variable} ${fontMont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
