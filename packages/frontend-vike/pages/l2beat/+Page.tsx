import { useData } from '../../renderer/useData'
import './code.css'
import { L2BEATResponse } from './types'

export { Page }

function Page() {
  const data = useData<L2BEATResponse['data']['projects']>()

  return (
    <>
      <h1>L2BEAT</h1>
      <div>
        {data.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
    </>
  )
}
