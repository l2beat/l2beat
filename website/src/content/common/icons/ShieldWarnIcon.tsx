import { SVGAttributes } from 'react'
import { Icon } from './Icon'

interface Props extends SVGAttributes<SVGElement> {
  outline?: boolean
}

export function ShieldWarnIcon({ outline, ...props }: Props) {
  return (
    <Icon {...props}>
      {outline ? (
        <>
          <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6,2.25V11.09z" />
          <rect height="2" width="2" x="11" y="14" />
          <rect height="5" width="2" x="11" y="7" />
        </>
      ) : (
        <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M13,16h-2v-2h2V16z M13,12h-2V7h2V12z" />
      )}
    </Icon>
  )
}
