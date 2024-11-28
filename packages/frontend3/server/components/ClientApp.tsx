import { ClientApps } from './ClientApps'

let appId = 0
export function resetAppId() {
  appId = 0
}

export function ClientApp<K extends keyof ClientApps>(props: {
  type: K
  data: ClientApps[K]
  className?: string
}) {
  const data = JSON.stringify(props.data)
  const init = appId === 0 ? 'window.APP_DATA={};' : ''
  const code = `${init}APP_DATA[${++appId}]=${data};`
  return (
    <>
      <script data-foo="bar" dangerouslySetInnerHTML={{ __html: code }} />
      <div
        data-app={props.type}
        data-app-id={appId}
        className={props.className}
      />
    </>
  )
}
