import { AddressBar } from '~/components/AddressBar'
import { Footer } from '~/components/footer/Footer'
import { MainLogo } from './assets/MainLogo'

export default function Home() {
  return (
    <main className="md:px-6 md:pt-6 pt-4 px-4 min-h-screen">
      <div className="flex flex-col rounded-xl flex-1 min-h-[calc(100vh-120px)] px-5 bg-white dark:bg-zinc-900 justify-center items-center">
        <div className="flex flex-col gap-14 items-center w-[min(77vw,320px)] min-w-[260px]">
          <MainLogo className="w-full" />
          <AddressBar />
        </div>
      </div>
      <Footer />
    </main>
  )
}
