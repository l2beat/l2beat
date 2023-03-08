import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ZkSyncIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="zkSync logo" {...props}>
      <path
        d="M24 11.7867L17.1921 5.00256V9.9709L10.4325 14.9454L17.1921 14.95V18.5707L24 11.7867Z"
        className="fill-[#4E529A] dark:fill-current"
      />
      <path
        d="M0 11.7841L6.8079 18.5681V13.6398L13.5676 8.62531L6.8079 8.62066V5L0 11.7841Z"
        className="fill-[#8C8DFC] dark:fill-current"
      />
    </Icon>
  )
}
