import { Feature as FeatureType } from '@l2beat/config'
import { useEffect, useRef, useState } from 'react'

import styles from './styles.module.scss'

interface FeatureProps {
  feature: FeatureType
}

export function Feature({ feature }: FeatureProps) {
  const [open, setOpen] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const wrapped = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapper.current || !wrapped.current) {
      return
    }
    if (open) {
      const innerHeight = wrapped.current.getBoundingClientRect().height
      wrapper.current.style.height = `${innerHeight}px`
    } else {
      wrapper.current.style.height = '0px'
    }
  }, [open])

  return (
    <li className={styles.feature}>
      <div className={styles.featureHeader} onClick={() => setOpen((x) => !x)}>
        {open ? <Minus /> : <Plus />}
        {feature.risks.length > 0 && <Warning />}
        {feature.name}
      </div>
      <div ref={wrapper} className={styles.wrapper}>
        <div ref={wrapped} className={styles.wrapped}>
          <div>
            <p className={styles.description}>{feature.generalDescription}</p>
            {feature.specificDescription && <p className={styles.description}>{feature.specificDescription}</p>}
          </div>
          {feature.pointers.length > 0 && (
            <ul className={styles.links}>
              {feature.pointers.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {feature.risks.length > 0 && (
            <>
              <p className={styles.risksTitle}>Risks:</p>
              <ol className={styles.risks}>
                {feature.risks.map((risk, i) => (
                  <li key={i}>
                    <span className={styles.risk}>{risk.type}.</span> {risk.description}
                  </li>
                ))}
              </ol>
            </>
          )}
          {feature.overrides && (
            <div>
              <p>This is in contrast to how the technology works usually:</p>
              <p>{feature.overrides.name}</p>
              <p>{feature.overrides.generalDescription}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function Plus() {
  return (
    <svg className={styles.openIcon} viewBox="0 0 24 24" stroke="currentcolor" strokeWidth={3}>
      <path d="M2 12 L22 12 M12 2 L12 22" />
    </svg>
  )
}

function Minus() {
  return (
    <svg className={styles.openIcon} viewBox="0 0 24 24" stroke="currentcolor" strokeWidth={3}>
      <path d="M2 12 L22 12" />
    </svg>
  )
}

function Warning() {
  return (
    <svg className={styles.warningIcon} viewBox="0 0 24 24" fill="currentcolor">
      <path
        fillRule="evenodd"
        d="M12 0L0 24H24L12 0ZM13 17L14 9H10L11 17H13ZM14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20Z"
      />
    </svg>
  )
}
