import { Badge } from './Badge'

export interface Props {
  className?: string
}

export function NaBadge(props: Props) {
  return (
    <Badge className={props.className} type="gray" size="small">
      N/A
    </Badge>
  )
}
