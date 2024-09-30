import { BridgesMvpWarning } from './_components/bridges-mvp-warning'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BridgesMvpWarning />
      {children}
    </>
  )
}
