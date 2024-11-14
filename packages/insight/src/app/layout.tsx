import { type Metadata } from 'next'

import { TRPCReactProvider } from '~/trpc/react'
import { getDefaultMetadata } from '~/utils/metadata'
import { TooltipProvider } from '../components/core/tooltip/tooltip'
import '../styles/globals.css'
import { inter } from '~/fonts/inter'
import { oswald } from '~/fonts/oswald'
import { cn } from '~/utils/cn'

export const metadata: Metadata = getDefaultMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-us">
      <head>
        {/* The rest of the icons are handled by the App Router */}
        <link rel="mask-icon" href="/mask-icon.svg" />
        {/* Prevent zooming on input click on iOS by adding maximum-scale=1 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={cn(
          inter.variable,
          oswald.variable,
          'bg-[#0B0B1C] font-inter text-base text-white md:text-lg',
        )}
      >
        <TRPCReactProvider>
          <TooltipProvider delayDuration={300} disableHoverableContent>
            {children}
          </TooltipProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
