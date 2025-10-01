import {Geist, Geist_Mono, Roboto} from "next/font/google";
import "./globals.css";

import Navigation from "@/component/navigation/Navigation";
import COLOUR from "@/util/COLOUR";
import Script from "next/script";
import BlueBlobBackground from "@/util/BlueBlobBackground";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
        
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
      className={`${roboto} antialiased min-h-screen`}
    >
      <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
      />
      <BlueBlobBackground>
        <main className="w-screen min-h-screen flex flex-col">
          <Navigation />
          <div className="mx-auto w-full h-full max-w-7xl">
            {children}
          </div>
        </main>
      </BlueBlobBackground>
    </body>
  </html>
);
}
