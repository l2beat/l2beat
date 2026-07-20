import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

export function FreshCropsBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex size-6 shrink-0 items-center justify-center text-base leading-none transition-transform duration-200 hover:-translate-y-0.5"
          aria-hidden
        >
          🌱
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[260px]">
        <span className="font-medium text-[#16863f] text-sm dark:text-[#3fe07f]">
          🌱 Fresh crops
        </span>
        <p className="mt-1 text-primary">
          Every category — censorship resistance, open source, privacy, and
          security — is rated good, with no outstanding issues.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
