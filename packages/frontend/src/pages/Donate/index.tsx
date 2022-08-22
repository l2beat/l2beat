import React from 'react'

import { DonatePage } from './DonatePage'
import { getProps } from './getProps'

export async function getDonatePage() {
  return {
    slug: '/donate',
    page: <DonatePage {...await getProps()} />,
  }
}
