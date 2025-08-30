import { Roboto} from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar'

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-roboto",   
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${roboto} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
