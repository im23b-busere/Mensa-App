import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Mensa-BZZ',
  description: 'Mensa-BZZ Menu App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 text-slate-800 font-sans min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
