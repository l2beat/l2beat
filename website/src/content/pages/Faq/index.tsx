import React from 'react'

import { FaqPage } from './FaqPage'
import { getFaqPageProps } from './getFaqPageProps'

export function Faq() {
  return <FaqPage {...getFaqPageProps()} />
}
