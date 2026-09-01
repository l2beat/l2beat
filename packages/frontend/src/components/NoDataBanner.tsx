import { ClockIcon } from '~/icons/Clock'
import { Callout } from './Callout'

interface Props {
  content: string
}

export function NoDataBanner({ content }: Props) {
  return (
    <Callout
      color="gray"
      body={content}
      icon={<ClockIcon />}
      className="px-4 py-2"
    />
  )
}
