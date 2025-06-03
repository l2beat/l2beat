import { Badge } from './Badge'

export interface Props {
  className?: string
}

export function NoDataBadge(props: Props) {
  return (
    <Badge className={props.className} type="gray" size="small">
      No data
    </Badge>
  )
}
