import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from '@/components/SessionWrapper'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Spotify Graph",
  description: "Shows graphical information about your spotify account",
};


export default async function RootLayout({login, graphs}) {

  const session = await getServerSession(authOptions)

  return (
    <SessionWrapper>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {session ? graphs : login}
      </body>
    </html>
    </SessionWrapper>
  );
}
