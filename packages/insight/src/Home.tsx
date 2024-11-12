import { Search } from './Search'
import LogoDouble from './assets/logo-double.svg'

interface Props {
  onSearch: (query: string) => void
}

export function Home(props: Props) {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center">
      <h1 className="mb-10 text-center font-bold text-3xl">
        <img src={LogoDouble} alt="Insight by L2BEAT" />
      </h1>
      <Search isHome onSearch={props.onSearch} />
    </div>
  )
}
