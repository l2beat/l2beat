import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { getCollection } from '../../../content/getCollection'
import { getProps } from './props/getProps'
import { GovernancePostPage } from './view/GovernancePostPage'

export function getGovernancePostPages(config: Config) {
  const posts = getCollection('posts')

  return posts.map((post) => {
    const { wrapper, props } = getProps(config, post)

    return {
      slug: `/governance/posts/${post.id}`,
      page: (
        <PageWrapper {...wrapper}>
          <GovernancePostPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
