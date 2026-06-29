import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "רוני סטודיו · מרכז השליטה",
  description: "מנוע ה-UGC של רוני — הכל במקום אחד",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 max-w-[1100px] mx-auto px-6 py-7 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
