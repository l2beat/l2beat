import { Badge, type BadgeProps } from './Badge'

interface Props {
  className?: string
  size?: BadgeProps['size']
}

export function NoDataBadge({ className, size = 'small' }: Props) {
  return (
    <Badge className={className} type="gray" size={size}>
      No data
    </Badge>
  )
}
