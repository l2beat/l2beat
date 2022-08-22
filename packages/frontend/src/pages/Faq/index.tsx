import React from 'react'

import { FaqPage } from './FaqPage'
import { getProps } from './getProps'

export function getFaqPage() {
  return {
    slug: '/faq',
    page: <FaqPage {...getProps()} />,
  }
}
