import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'

interface Props {
  backgroundImage: string
  className?: string
}

export function PrivacyBestPracticesBanner({
  backgroundImage,
  className,
}: Props) {
  return (
    <PrimaryCard
      asChild
      className={cn('mt-4 overflow-hidden rounded-lg! p-0 md:p-0', className)}
    >
      <CustomLink
        variant="plain"
        underline={false}
        href="/privacy/best-practices"
        className="group relative flex min-h-[128px] select-none overflow-hidden rounded-lg text-pure-white"
      >
        <div
          className="absolute inset-0 origin-left bg-center bg-cover transition-[scale] ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-pure-black/35" />
        <div className="relative flex w-full items-center justify-between gap-4 p-5 md:p-6">
          <div>
            <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
              Ready for a new identity?
            </div>
            <div className="origin-left text-balance font-bold text-2xl leading-tight! transition-[translate,scale] ease-in-out group-hover:translate-x-4 group-hover:scale-110 md:text-3xl">
              Onchain privacy best practices
            </div>
          </div>
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-pure-white/15 backdrop-blur-sm transition-colors group-hover:bg-pure-white/25">
            <ArrowRightIcon className="size-4" />
          </div>
        </div>
      </CustomLink>
    </PrimaryCard>
  )
}
