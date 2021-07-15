import { Chart, Header, Logo, Page } from '../../common'
import { MetaImageProps } from './getMetaImageProps'

export function MetaImage(props: MetaImageProps) {
  return (
    <Page
      title="Meta Image"
      preloadApi={props.apiEndpoint}
      includeMetaImageStyles
    >
      <script
        dangerouslySetInnerHTML={{
          __html: "localStorage.setItem('l2beat-theme', 'light')",
        }}
      />
      <Header
        title={props.name ?? 'Overview'}
        icon={props.icon}
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} days={30} />
      <Logo />
    </Page>
  )
}
