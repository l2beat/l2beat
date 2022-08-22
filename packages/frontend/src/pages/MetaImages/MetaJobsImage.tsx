import cx from 'classnames'
import React from 'react'

import { Logo, Page } from '../../components'

export function MetaJobsImage() {
  return (
    <Page
      htmlClassName="light"
      metadata={{
        title: 'Meta Image',
        description: '-',
        image: '-',
        url: '-',
      }}
      includeMetaImageStyles
    >
      <div className={cx('Meta jobs')}>
        <Logo />
        <h1>Work at</h1>
      </div>
    </Page>
  )
}
