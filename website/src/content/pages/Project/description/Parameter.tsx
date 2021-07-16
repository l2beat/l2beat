import { ReactChild } from 'react'

import { Pointers } from './Pointers'
import { SentimentIcon } from './SentimentIcon'

interface Props {
  name: string
  value: ReactChild
  sentiment?: 'good' | 'neutral' | 'bad'
  tooltip?: string
  pointers?: string[]
}

export function Parameter(props: Props) {
  return (
    <li className="parameters__parameter">
      <span className="parameters__name">{addTerminator(props.name, ':')}</span>
      <div className="parameters__value" data-sentiment={props.sentiment}>
        {props.sentiment && <SentimentIcon sentiment={props.sentiment} />}
        <span>{props.value}</span>
      </div>
      {props.tooltip && (
        <div className="parameters__details">
          {addTerminator(props.tooltip, '.')}
        </div>
      )}
      <Pointers pointers={props.pointers} />
    </li>
  )
}

function addTerminator(text: string, terminator: string) {
  return /\w$/.test(text) ? `${text}${terminator}` : text
}
