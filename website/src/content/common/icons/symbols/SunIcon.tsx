import { SVGAttributes } from 'react'
import { Icon } from '../Icon'

export function SunIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M14.87 4.11L12 0L9.13 4.11L4.29 2.81L4.73 7.8L0.18 9.92L3.73 13.46L1.61 18L6.6 18.43L7.9 23.28L12 20.4L16.1 23.28L17.4 18.43L22.39 18L20.27 13.46L23.82 9.92L19.27 7.8L19.71 2.81L14.87 4.11ZM16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12ZM18 12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12Z"
      />
    </Icon>
  )
}
