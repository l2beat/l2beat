import logo from './assets/logo.png'

export interface SsrData {
  url: string
  city: string
  letter: string
}

export function App({ ssrData }: { ssrData: SsrData }) {
  return (
    <div>
      <h1>City: {ssrData.city}</h1>
      <p>Letter: {ssrData.letter}</p>
      <img src={logo} width={50} height={50} />
    </div>
  )
}
