import cx from 'classnames'
import { Logo } from './Logo'
import { PercentChange } from './PercentChange'

interface Props {
  title: string
  titleLength?: 'long' | 'very-long'
  icon?: string
  tvl?: string
  sevenDayChange?: string
}

export function Header(props: Props) {
  return (
    <header className="Header">
      <h1 className={cx('Header-Title', props.titleLength)}>
        {props.icon && <img className="Header-Icon" src={props.icon} />}
        {props.title}
        {!props.title && <Logo />}
      </h1>
      {props.tvl && props.sevenDayChange && (
        <div className="Header-Right">
          <p className="Header-Tvl">
            TVL: <span className="Header-TvlValue">{props.tvl}</span>
          </p>
          <p className="Header-Change">
            <PercentChange value={props.sevenDayChange} /> / 7 days
          </p>
        </div>
      )}
    </header>
  )
}
