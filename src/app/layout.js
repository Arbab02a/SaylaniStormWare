import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SaylaniStormWare - Modern Sharing Solution',
  description: 'SaylaniStormWare is a modern web application and AirForShare alternative for file and text sharing. It has many other features as well ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
        </body>
      
    </html>
  )
}
