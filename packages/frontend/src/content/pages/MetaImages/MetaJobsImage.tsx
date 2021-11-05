import cx from 'classnames'
import React from 'react'

import { Logo, Page } from '../../common'

export function MetaJobsImage() {
  return (
    <Page
      metadata={{
        title: 'Meta Image',
        description: '-',
        image: '-',
        url: '-',
      }}
      includeMetaImageStyles
    >
      <script dangerouslySetInnerHTML={{ __html: '__DARK_MODE__ = true' }} />
      <div className={cx('Meta jobs')}>
        <Logo />
        <h1>Work at</h1>
      </div>
    </Page>
  )
}
