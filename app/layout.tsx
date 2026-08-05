import type { Metadata, Viewport } from 'next'
import { Fredoka, Bubblegum_Sans } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
})

const bubblegum = Bubblegum_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bubblegum',
})

export const metadata: Metadata = {
  title: 'BeeFocus — Study Dashboard',
  description: 'A cozy bee-themed study companion to keep you on track for finals.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#faf1cf',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${bubblegum.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
