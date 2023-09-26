import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './getProps'

export function getL2DaysPage() {
  const { wrapper } = getProps()
  return {
    slug: '/l2days',
    page: (
      <PageWrapper {...wrapper}>
        <iframe
          src="https://drive.google.com/file/d/1IxAQHXDb4mamvI5rYzBddmjToDp5uZiN/preview"
          className="h-screen w-full"
        />
      </PageWrapper>
    ),
  }
}
