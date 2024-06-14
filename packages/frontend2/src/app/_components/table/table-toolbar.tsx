import { OverflowWrapper } from '../overflow-wrapper'

interface Props {
  children: React.ReactNode
}

export const TableToolbar = ({ children }: Props) => {
  return (
    <OverflowWrapper childrenClassName="flex items-center gap-2 mb-2">
      {children}
    </OverflowWrapper>
  )
}
