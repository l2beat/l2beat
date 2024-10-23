import { ReactNode } from 'react'

export function Icon(props: { children: ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      className={props.className}
    >
      {props.children}
    </svg>
  )
}
