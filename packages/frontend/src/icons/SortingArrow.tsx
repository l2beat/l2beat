import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SortingArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="10" height="6" viewBox="0 0 10 6" {...props}>
      <path d="M5.00006 0.5C4.86153 0.5 4.72298 0.551171 4.61709 0.653809L0.283789 4.85381C0.128873 5.00396 0.0824004 5.22963 0.166358 5.42598C0.249774 5.62233 0.447929 5.75 0.666761 5.75H9.33336C9.55219 5.75 9.75035 5.62233 9.83376 5.42598C9.91772 5.22963 9.87125 5.00396 9.71633 4.85381L5.38303 0.653809C5.27714 0.551171 5.13859 0.5 5.00006 0.5Z" />
    </SvgIcon>
  )
}
