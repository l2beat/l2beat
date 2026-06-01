import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ShieldIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      aria-label="Shield with an exclamation mark icon"
      viewBox="0 0 16 20"
      width="16"
      height="20"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8.086 20c8.408-4.5 7.908-16 7.908-16C11.497 4 8 0 8 0S4.003 4 .005 4c0 0-.5 11.5 8.081 16m-1.014-6.302a1 1 0 00-.072.373q0 .202.072.37.07.167.201.293a.9.9 0 00.312.197q.182.069.412.069t.414-.069a.876.876 0 00.518-.49.9.9 0 00.071-.37 1 1 0 00-.072-.373.892.892 0 00-.518-.492 1.2 1.2 0 00-.413-.071q-.23 0-.412.07a.9.9 0 00-.312.197.9.9 0 00-.201.296M7.253 12H8.74l.21-6H7.043z"
      />
    </SvgIcon>
  )
}
