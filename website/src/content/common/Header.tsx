import { PercentChange } from './PercentChange'

interface Props {
  title: string
  titleLength?: 'long' | 'very-long'
  icon?: string
  tvl?: string
  sevenDayChange?: string
}

export function Header(props: Props) {
  const titleClassName = props.titleLength
    ? `header__title header__title--${props.titleLength}`
    : 'header__title'
  return (
    <header className="header">
      <h1 className={titleClassName}>
        {props.icon && <img className="header__icon" src={props.icon} />}
        {props.title}
      </h1>
      {props.tvl && props.sevenDayChange && (
        <div className="header__right">
          <p className="header__tvl">
            TVL: <span className="header__tvl-value">{props.tvl}</span>
          </p>
          <p className="header__change">
            <PercentChange value={props.sevenDayChange} /> / 7 days
          </p>
        </div>
      )}
    </header>
  )
}
