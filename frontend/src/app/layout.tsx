import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TALA - Trust is Code',
  description: 'Zero-trust time capsules for Indian exam, tender, and evidence workflows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-yellow-100">
        {children}
      </body>
    </html>
  )
}
