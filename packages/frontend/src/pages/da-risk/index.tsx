import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './getProps'

export function getDARiskPage() {
  const { wrapper } = getProps()
  return {
    slug: '/da-risk',
    page: (
      <PageWrapper {...wrapper}>
        <iframe
          src="https://drive.google.com/file/d/1sV1n8CGmxb96If7ey-qRvdmVXPI-h1aY/preview"
          className="h-screen w-full"
        />
      </PageWrapper>
    ),
  }
}
