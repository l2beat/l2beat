import Image from 'next/image'
import multisigReportImage from './landscape.png'

export function ReportBanner() {
  return (
    <div className="mb-10 mt-8 flex max-h-fit flex-col overflow-hidden rounded-md bg-transparent from-gray-250 to-gray-450 md:my-12 md:grid md:grid-cols-2 md:bg-gradient-to-r">
      <div className="mx-0 my-8 flex flex-col justify-center md:mx-12">
        <div className="mb-2 font-medium uppercase leading-5 text-gray-50 md:text-xl md:text-[#4F4F4F]">
          Just Released
        </div>
        <div className="text-2xl font-medium leading-tight text-primary md:text-5xl md:text-black md:dark:text-black">
          Upgradeability of Ethereum L2s
        </div>
      </div>
      <Image
        alt=""
        src={multisigReportImage}
        className="h-full max-h-[320px] rounded-md md:rounded-none"
      />
    </div>
  )
}
