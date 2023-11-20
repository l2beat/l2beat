import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function LivenessIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="Liveness icon"
      {...props}
    >
      <path
        d="M0 2.66667C0 1.2 1.2 0 2.66667 0H21.3333C22.8 0 24 1.2 24 2.66667V21.3333C24 22.8 22.8 24 21.3333 24H2.66667C1.2 24 0 22.8 0 21.3333V2.66667Z"
        fill="#455A64"
      />
      <path
        d="M13.2 23.0667L10.5333 8.46674L7.93333 18.9334L6.53333 12.4667L6.46667 12.6667H0V11.3334H5.53333L6.8 7.53341L8.06667 13.0667L10.8 2.20007L13.4667 16.9334L16 7.46674L17.5333 12.8667L18.2667 11.3334H24V12.6667H19.0667L17.1333 16.4667L16 12.5334L13.2 23.0667Z"
        fill="#AEEA00"
      />
    </Icon>
  )
}
