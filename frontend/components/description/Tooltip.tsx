import HelpIcon from '@material-ui/icons/HelpOutline'
import cx from 'classnames'

import styles from './styles.module.scss'

interface TooltipProps {
  text: string
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div className={cx(styles.tooltip, 'tooltip')} tabIndex={0} data-content={text}>
      <HelpIcon fontSize="small" />
    </div>
  )
}
