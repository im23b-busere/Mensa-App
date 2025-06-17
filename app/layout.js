import './globals.css';
import Header from '../components/Header';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Mensa-BZZ',
  description: 'Mensa-BZZ Menu App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <div className="pt-20">{children}</div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
