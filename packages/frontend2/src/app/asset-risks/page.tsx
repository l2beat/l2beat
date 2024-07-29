import Image from 'next/image'
import AssetRiskLogo from './_assets/asset-risk-logo.svg?url'
import { AddressForm } from './_components/address-form'
import { Footer } from './_components/footer'

export default async function AssetsRiskPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-[#E6E7EC] p-4 md:p-6">
      <div className="flex min-h-[calc(100vh-120px)] flex-1 flex-col items-center justify-center rounded-xl bg-white px-5 dark:bg-zinc-900">
        <div className="flex w-[min(77vw,400px)] min-w-[260px] flex-col items-center gap-14">
          <Image
            src={AssetRiskLogo}
            alt="Asset risks Logo"
            width={360}
            height={180}
            className="w-full"
          />
          <AddressForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
