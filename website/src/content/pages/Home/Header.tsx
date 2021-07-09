import { PercentChange } from '../../common'

interface Props {
  tvl: string
  sevenDayChange: string
}

export function Header({ tvl, sevenDayChange }: Props) {
  return (
    <header className="header">
      <h1 className="header__title">Overview</h1>
      <div className="header__right">
        <p className="header__tvl">
          TVL: <span className="header__tvl-value">{tvl}</span>
        </p>
        <p className="header__change">
          <PercentChange value={sevenDayChange} /> / 7 days
        </p>
      </div>
    </header>
  )
}
