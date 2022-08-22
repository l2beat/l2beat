import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo, Page } from '../../common'
import { config } from '../../config'
import { MetaImageProps } from './getProps'

export function MetaImage(props: MetaImageProps) {
  return (
    <Page
      htmlClassName="light"
      metadata={props.metadata}
      preloadApi={props.apiEndpoint}
      includeMetaImageStyles
    >
      <div className={cx('Meta', !props.name ? 'overview' : 'project')}>
        {config.showNewUpdateBanner && (
          <div className="Meta-Update">New Update Out Now!</div>
        )}
        <Header
          title={props.name ?? 'Overview'}
          icon={props.icon}
          tvl={props.tvl}
          sevenDayChange={props.sevenDayChange}
        />
        <Chart endpoint={props.apiEndpoint} days={30} />
        <Logo />
      </div>
    </Page>
  )
}
