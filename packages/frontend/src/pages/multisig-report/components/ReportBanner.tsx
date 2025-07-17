import type { ImageParams } from '~/utils/project/getImageParams'

export function ReportBanner({ image }: { image: ImageParams }) {
  return (
    <div className="mt-8 mb-10 flex max-h-fit flex-col overflow-hidden rounded-md bg-transparent from-gray-250 to-gray-450 md:my-12 md:grid md:grid-cols-2 md:bg-linear-to-r">
      <div className="mx-0 my-8 flex flex-col justify-center md:mx-12">
        <div className="mb-2 font-medium text-gray-50 uppercase leading-5 md:text-[#4F4F4F] md:text-xl">
          Just Released
        </div>
        <div className="font-medium text-2xl text-primary leading-tight md:text-5xl md:text-black md:dark:text-black">
          Upgradeability of Ethereum L2s
        </div>
      </div>
      <img
        alt=""
        {...image}
        className="h-full max-h-[320px] rounded-md md:rounded-none"
      />
    </div>
  )
}
