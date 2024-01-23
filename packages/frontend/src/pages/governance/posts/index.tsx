import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getCollection } from '../../../content/getCollection'
import { getProps } from './props/getProps'
import { GovernanceAllPostsPage } from './view/GovernanceAllPostsPage'

export function getGovernanceAllPostsPage(config: Config) {
  const posts = getCollection('posts')

  const { wrapper, props } = getProps(config, posts)

  return {
    slug: '/governance/posts',
    page: (
      <PageWrapper {...wrapper}>
        <GovernanceAllPostsPage {...props} />
      </PageWrapper>
    ),
  }
}
