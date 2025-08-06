import { Badge } from './Badge'

interface Props {
  className?: string
}

export function NotApplicableBadge(props: Props) {
  return (
    <Badge className={props.className} type="gray" size="small">
      N/A
    </Badge>
  )
}
