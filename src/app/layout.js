import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SSC Exam Track Pro - Student Productivity Platform",
  description: "Track your SSC exams, manage to-dos, read motivational content, and access study resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
