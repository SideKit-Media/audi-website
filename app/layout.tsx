import type { Metadata } from 'next'
import { Saira_Condensed, DM_Mono, Barlow } from 'next/font/google'
import './globals.css'

const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-saira',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Audi Sport | e-tron GT Race — Quattro Motorsport',
  description: 'FIA GT3 homologated. 630 PS. Quattro AWD. Where electric meets motorsport.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sairaCondensed.variable} ${dmMono.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  )
}
