import { roboto_serif } from '~/fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={roboto_serif.variable}>{children}</div>
}
