import type { PrivacyAttribute } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

const ATTRIBUTE_CLASS_NAMES: Record<string, string> = {
  fhe: 'text-[#5C3B00] bg-[#FFE8A3] border-[#D9A31A]',
  zk: 'text-[#6B2D00] bg-[#FFD5A3] border-[#E2872A]',
  transfers: 'text-[#17452A] bg-[#C8F2D7] border-[#4FB875]',
  defi: 'text-[#5D1163] bg-[#F7B3FF] border-[#D96BE8]',
  anyAmount: 'text-[#3F1E6D] bg-[#C7B8FF] border-[#8D78D9]',
  fixedAmounts: 'text-[#452576] bg-[#D8CEFF] border-[#9B86E6]',
  privateAmounts: 'text-[#0F3F3A] bg-[#BFEFE5] border-[#45B8A7]',
}

export function PrivacyAttributeTag({
  attribute,
}: {
  attribute: PrivacyAttribute
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'inline-flex select-none items-center rounded border px-1.5 py-0.5 font-medium text-xs',
            ATTRIBUTE_CLASS_NAMES[attribute.id],
          )}
        >
          {attribute.label}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{attribute.description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
