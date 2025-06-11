import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Mensa-BZZ',
  description: 'Mensa-BZZ Menu App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Header />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
