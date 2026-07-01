import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Aplicação Modelo | Plataforma Modular",
  description: "Demonstração de gestão de cadastros e módulos - Exemplo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <ToastContainer position="top-right" theme="colored" />
          <div id="modal-portal" />
        </AuthProvider>
      </body>
    </html>
  );
}
