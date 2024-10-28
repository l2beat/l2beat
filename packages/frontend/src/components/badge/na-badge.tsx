import { Badge } from './badge'

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
