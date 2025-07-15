import type { ZkCatalogTag } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'

export function TechStackTag({ tag }: { tag: ZkCatalogTag }) {
  return (
    <div
      className={cn(
        'rounded-sm border p-1.5 font-medium text-[13px] leading-none',
        getClassNames(tag),
      )}
    >
      {tag.type}: {tag.name}
    </div>
  )
}

function getClassNames(tag: ZkCatalogTag) {
  switch (tag.type) {
    case 'STARK':
      return 'text-[#9D19A4] bg-[#FD79FF] border-[#FC59FF]'
    case 'ISA':
      return 'text-[#6FF5FF] bg-[#2F2A61] border-[#1E194E]'
    case 'curve':
      return 'bg-pure-white text-pure-black border-[#1E194E]'
    case 'Field':
      return 'text-pure-black border-[#1E194E] bg-[#66FF64]'
    case 'PCS':
      return 'text-[#FDFF6D] border-[#9D6100] bg-[#7C0909]'
    case 'Arithmetization':
      return 'bg-[#60837A] text-white border-[#60837A]'
    case 'Other':
      return 'bg-[#CCD0DA] border-[#808CAA] text-[#272A2F]'
    case 'Fflonk':
      return 'text-[#007DAE] bg-[#93FFDB] border-[#29BD8C]'
    case 'Groth16':
      return 'text-[#0A2C64] bg-[#C9DDFF] border-[#879FFF]'
    case 'Plonk':
      return 'text-[#5A3216] bg-[#FFA91E] border-[#D78400]'
    default:
      assertUnreachable(tag.type)
  }
}
