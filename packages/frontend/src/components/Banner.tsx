import { cva, type VariantProps } from 'class-variance-authority'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { Markdown } from './markdown/Markdown'

const bannerVariants = cva(
  'flex gap-2 rounded-lg border px-6 py-2 font-medium text-paragraph-13',
  {
    variants: {
      type: {
        info: 'border-link bg-surface-info text-link',
        warning: 'border-yellow-700 bg-surface-warning text-yellow-900',
        negative: 'border-negative bg-surface-negative text-negative',
      },
      centered: {
        true: 'justify-center',
      },
    },
  },
)

type Props = VariantProps<typeof bannerVariants> &
  (
    | {
        asMarkdown: true
        children: string
        className?: string
        hideIcon?: boolean
      }
    | {
        asMarkdown?: false
        children: React.ReactNode
        className?: string
        hideIcon?: boolean
      }
  )

export function Banner({
  children,
  asMarkdown,
  type,
  centered,
  className,
  hideIcon,
}: Props) {
  return (
    <div className={cn(bannerVariants({ type, centered }), className)}>
      {!hideIcon && (
        <InfoIcon className="mt-px size-[14px] shrink-0 fill-current" />
      )}
      {asMarkdown ? <Markdown>{children}</Markdown> : children}
    </div>
  )
}
