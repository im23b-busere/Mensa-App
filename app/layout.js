import './globals.css';
import Header from '../components/Header';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Mensa-BZZ',
  description: 'Mensa-BZZ Menu App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <AuthProvider>
          <Header />
          <div className="pt-20">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
