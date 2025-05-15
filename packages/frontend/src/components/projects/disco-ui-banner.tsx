import Image from 'next/image'
import Link from 'next/link'
import { DiscoUiIcon } from '~/icons/disco-ui'
import { CustomLinkIcon } from '~/icons/outlink'

export function DiscoUiBanner({ href }: { href: string }) {
  return (
    <>
      {/* Desktop */}
      <div className="h-20 w-full overflow-hidden rounded bg-[#F0D8BD] max-md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex w-1/2 min-w-[220px] flex-col gap-2 px-4 py-3">
            <DiscoUiIcon short className="fill-[#5A3C2C]" />
            <Link
              href={href}
              target="_blank"
              className="flex items-center gap-1.5 text-sm font-medium text-link underline"
            >
              Explore in Discovery UI
              <CustomLinkIcon className="size-4 fill-link" />
            </Link>
          </div>
          <div className="h-20 w-1/2">
            <Image
              src={'/images/disco-ui-desktop.png'}
              alt="Disco UI Banner"
              className="size-full object-cover"
              width={423}
              height={160}
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
        <Link
          target="_blank"
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded bg-white py-2 text-link"
          href={href}
        >
          <span className="text-xs font-bold text-primary">
            Explore in Disco
          </span>
          <CustomLinkIcon className="size-4 fill-link" />
        </Link>
      </div>
    </>
  )
}
