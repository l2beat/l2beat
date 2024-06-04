declare module '*.svg' {
  import { type FC, type SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: string // it is not a string but we do this to avoid errors
  export default content
}
