import { SVGAttributes } from 'react'
import { Icon } from './Icon'

interface Props extends SVGAttributes<SVGElement> {
  outline?: boolean
}

export function ShieldGoodIcon({ outline, ...props }: Props) {
  return (
    <Icon {...props}>
      {outline ? (
        <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12l6,2.12V11.09z M8.82,10.59L7.4,12l3.54,3.54l5.66-5.66l-1.41-1.41l-4.24,4.24L8.82,10.59z" />
      ) : (
        <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M10.94,15.54L7.4,12l1.41-1.41l2.12,2.12 l4.24-4.24l1.41,1.41L10.94,15.54z" />
      )}
    </Icon>
  )
}
