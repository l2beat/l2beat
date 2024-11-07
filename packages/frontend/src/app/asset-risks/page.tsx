import { InsightLogo } from './_assets/logo'
import { WalletInput } from './_components/wallet-input'

export default async function AssetsRiskPage() {
  return (
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    <main className="min-h-screen bg-gradient-to-b from-[#0B0B1C] from-70% via-[#353482] via-90% to-[#A22BCC] p-4">
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-12">
        <InsightLogo className="w-full" />
        <WalletInput className="w-[560px]" />
      </div>
    </main>
  )
}
