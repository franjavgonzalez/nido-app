import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nido — Gestión financiera familiar",
  description: "Dashboard, transacciones, presupuesto, metas y reportes para tu familia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0D0F14] text-[#E8EAF2]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E2230',
              color: '#E8EAF2',
              border: '1px solid #2A3045',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4ADE80', secondary: '#1E2230' } },
            error: { iconTheme: { primary: '#F87171', secondary: '#1E2230' } },
          }}
        />
      </body>
    </html>
  );
}
