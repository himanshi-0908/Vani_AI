import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vani_AI',
  description: 'Created by Himanshi',
  
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
