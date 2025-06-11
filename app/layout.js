import './globals.css';

export const metadata = {
  title: 'Mensa-BZZ',
  description: 'Mensa-BZZ Menu App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
