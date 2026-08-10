import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CircleWithStarIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="m11.696 5.186-1.944 3.95-4.46.58a.326.326 0 00-.187.563l3.258 3.022-.812 4.31c-.051.27.242.479.491.347L12 15.876l3.958 2.084c.249.13.542-.077.491-.348l-.812-4.31 3.258-3.021a.326.326 0 00-.188-.563l-4.46-.58-1.943-3.95a.34.34 0 00-.608-.002" />
      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0m0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
    </SvgIcon>
  )
}
