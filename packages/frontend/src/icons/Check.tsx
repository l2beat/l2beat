import { motion } from 'motion/react'
import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CheckIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.1, delay: 0.1 }}
        d="M3.3 8.63L6.23 11.53L12.7 5.07"
      />
    </SvgIcon>
  )
}
