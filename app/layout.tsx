import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Elevated — Creative that performs',
    template: '%s · Elevated',
  },
  description: 'Turn product insights into brand-ready, campaign-ready creative.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
