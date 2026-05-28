import type { PrivacyAttribute } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

const ATTRIBUTE_CLASS_NAMES: Record<string, string> = {
  upgradeable: 'text-[#5A3216] bg-[#FFA91E] border-[#D78400]',
  optCompliance: 'text-[#004B3A] bg-[#A6F5D2] border-[#29BD8C]',
  transfers: 'text-[#4B1877] bg-[#D9B4FF] border-[#A45CDB]',
  defi: 'text-[#5D1163] bg-[#F7B3FF] border-[#D96BE8]',
  anyAmount: 'text-[#3F1E6D] bg-[#C7B8FF] border-[#8D78D9]',
  fixedAmounts: 'text-[#452576] bg-[#D8CEFF] border-[#9B86E6]',
  sourceAvailable: 'bg-[#CCD0DA] border-[#808CAA] text-[#272A2F]',
  immutable: 'text-[#6B4A00] bg-[#FFE08A] border-[#D6A900]',
  uncensorable: 'text-[#00445A] bg-[#A9ECF4] border-[#46C7D9]',
  enforcedCompliance: 'text-[#235000] bg-[#C9F59B] border-[#7AC943]',
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
