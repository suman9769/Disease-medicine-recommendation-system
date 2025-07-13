import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Medibot',
  description: 'Created with Medibot',
  generator: 'Medibot',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
