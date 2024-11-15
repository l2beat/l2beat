import Link from 'next/link'
import { WalletInput } from '~/components/wallet-input'
import { SmallInsightLogo } from '~/icons/logos/insight'

export function Navbar() {
  return (
    <>
      <div className="sticky top-0 z-30 h-14 min-w-fit border-b border-divider text-base lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-8">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <Link href="/">
                <SmallInsightLogo />
              </Link>
            </li>
          </ul>
          <div className="hidden items-center gap-3 md:flex">
            <WalletInput size="sm" className="w-[min(45vw,450px)]" />
          </div>
        </nav>
      </div>
    </>
  )
}
