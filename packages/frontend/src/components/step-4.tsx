import { useEffect } from 'react'
import Lottie from 'react-lottie-player'
import { getJson } from './summary-anim'

const json = getJson()

type Props = {
  onFinish: () => void
}
export function Step4(props: Props) {
  useEffect(() => {
    setTimeout(() => {
      props.onFinish()
    }, 3000)
  }, [props.onFinish])

  return (
    <div className="flex size-full items-center justify-center">
      <Lottie
        loop
        animationData={json}
        play
        style={{ width: 400, height: 400 }}
      />
    </div>
  )
}
