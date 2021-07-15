import { ProjectParameter } from '@l2beat/config'

import { Pointers } from './Pointers'
import { SentimentIcon } from './SentimentIcon'

export function Parameter({
  name,
  value,
  sentiment,
  tooltip,
  pointers,
}: ProjectParameter) {
  return (
    <>
      <dt className="parameters__name">{addTerminator(name, ':')}</dt>
      <dd className="parameters__value">
        <div className="parameters__value-main" data-sentiment={sentiment}>
          {sentiment && <SentimentIcon sentiment={sentiment} />}
          {value}
        </div>
        {tooltip && (
          <div className="parameters__details">
            {addTerminator(tooltip, '.')}
          </div>
        )}
        <Pointers pointers={pointers} />
      </dd>
    </>
  )
}

function addTerminator(text: string, terminator: string) {
  return /\w$/.test(text) ? `${text}${terminator}` : text
}
