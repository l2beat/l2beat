import React from 'react'

import { CrossIcon } from '../icons/Cross'

export function FloatingBannerCross() {
  return (
    <div className="FloatingBanner-Cross absolute top-0 right-0 mt-4 mr-4 cursor-pointer">
      <CrossIcon className="fill-gray-550 dark:fill-gray-50" />
    </div>
  )
}
