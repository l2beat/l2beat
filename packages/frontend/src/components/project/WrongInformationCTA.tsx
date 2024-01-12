import classNames from 'classnames'
import React from 'react'

import { Link } from '../Link'

interface WrongInformationCTAProps {
  issueLink: string
  editLink: string
}

export function WrongResearchCTA({
  issueLink,
  editLink,
}: WrongInformationCTAProps) {
  return (
    <div
      className={classNames(
        '-mx-4 mt-20 px-4 py-6 text-center md:mx-0 md:rounded-xl md:px-10',
        'bg-gradient-to-r from-purple-100/40 via-pink-100/40 to-red-200/40',
      )}
    >
      If you find something wrong on this page you can{' '}
      <Link href={issueLink}>submit an issue</Link>
      {' or '}
      <Link href={editLink}>edit the information</Link>
    </div>
  )
}
