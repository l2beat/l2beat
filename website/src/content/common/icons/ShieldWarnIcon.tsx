import { SVGAttributes } from 'react'
import { Icon } from './Icon'

export function ShieldWarnIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M13,16h-2v-2h2V16z M13,12h-2V7h2V12z" />
    </Icon>
  )
}
