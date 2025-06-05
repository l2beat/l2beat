import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArrowRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 15 14" width="15" height="14" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.10329 6.29419C1.73956 6.29419 1.4447 6.60754 1.4447 6.99408C1.4447 7.38062 1.73956 7.69397 2.10329 7.69397L11.6993 7.69397L8.27358 11.3345C8.01639 11.6079 8.01639 12.051 8.27358 12.3243C8.53078 12.5977 8.94777 12.5977 9.20496 12.3243L13.7549 7.489C14.0121 7.21568 14.0121 6.77253 13.7549 6.49921L9.20496 1.66387C8.94777 1.39055 8.53078 1.39055 8.27358 1.66387C8.01639 1.9372 8.01639 2.38035 8.27358 2.65367L11.6992 6.29419L2.10329 6.29419Z"
      />
    </SvgIcon>
  )
}
