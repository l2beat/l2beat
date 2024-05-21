import { AddressBar } from '~/components/AddressBar'
import { Footer } from '~/components/footer/Footer'
import { L2BEATLogo } from './assets/L2BEATLogo'

export default function Home() {
  return (
    <main className="px-6 pt-6 min-h-screen">
      <div className="flex flex-col rounded-xl flex-1 min-h-[calc(100vh-120px)] bg-white dark:bg-zinc-900 justify-center items-center">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl">LOGO</div>
            <L2BEATLogo className="w-[100px]" />
          </div>
          <AddressBar />
        </div>
      </div>
      <Footer />
    </main>
  )
}
