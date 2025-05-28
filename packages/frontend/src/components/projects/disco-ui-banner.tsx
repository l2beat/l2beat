import Image from 'next/image'
import { DiscoUiIcon } from '~/icons/disco-ui'
import { CustomLinkIcon } from '~/icons/outlink'

export function DiscoUiBanner({ href }: { href: string }) {
  return (
    <>
      {/* Desktop */}
      <div className="w-full overflow-hidden rounded bg-n-stone-200 dark:bg-n-stone-900 max-md:hidden">
        <div className="flex ">
          <div className="flex w-1/2 min-w-[260px] flex-col gap-2 px-6 pb-5 pt-3">
            <DiscoUiIcon
              short
              className="fill-n-stone-900 dark:fill-n-stone-200"
            />
            <div className="mb-0.5 text-xs text-primary">
              A dashboard to explore contracts and permissions
            </div>
            <a
              href={href}
              target="_blank"
              className="flex w-fit items-center gap-1.5 rounded bg-surface-primary px-4 py-2 text-sm font-medium text-link underline"
            >
              Go to Disco
              <CustomLinkIcon className="size-4 fill-link" />
            </a>
          </div>
          <div className="relative w-1/2">
            <Image
              src={'/images/disco-ui-desktop.png'}
              alt="Disco UI Banner"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="relative max-h-40 overflow-hidden rounded md:hidden">
        <Image
          src={'/images/disco-ui-mobile.png'}
          alt="Disco UI Banner"
          className="size-full object-cover object-top"
          width={423}
          height={160}
        />
        <a
          target="_blank"
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded bg-white py-2"
          href={href}
        >
          <span className="mt-px text-xs font-bold leading-none text-[#2A5BD8]">
            Explore in Disco
          </span>
          <CustomLinkIcon className="size-4 !fill-[#2A5BD8]" />
        </a>
      </div>
    </>
  )
}
