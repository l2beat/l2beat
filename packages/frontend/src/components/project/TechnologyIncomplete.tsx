import React from 'react'

import { OutLink } from '../OutLink'

export interface TechnologyIncompleteProps {
  editLink: string
  twitterLink: string | undefined
}

export function TechnologyIncomplete(props: TechnologyIncompleteProps) {
  return (
    <div className="TechnologyIncomplete" id="incomplete">
      <strong>Note:</strong> This project&apos;s overview requires more research
      and might not present accurate information. If you want to contribute you
      can{' '}
      <OutLink className="text-link underline" href={props.editLink}>
        edit the information on Github
      </OutLink>
      .{' '}
      {props.twitterLink && (
        <>
          Alternatively you{' '}
          <OutLink className="text-link underline" href={props.twitterLink}>
            contact the project team on Twitter
          </OutLink>{' '}
          and encourage them to contribute a PR.
        </>
      )}
    </div>
  )
}
