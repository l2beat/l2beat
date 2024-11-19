import { WalletInput } from '../components/wallet-input'
import { InsightLogo } from '../icons/logos/insight'

export default async function AssetsRiskPage() {
  return (
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    <main className="min-h-screen bg-gradient-to-b from-background from-70% via-[#353482] via-90% to-[#A22BCC] p-4">
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-12">
        <InsightLogo className="w-full" />
        <WalletInput className="w-[560px]" />
      </div>
    </main>
  )
}
