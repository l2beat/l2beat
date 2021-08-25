import { OutLink } from '../../../common'

export interface TechnologyIncompleteProps {
  editLink: string
  twitterLink: string | undefined
}

export function TechnologyIncomplete(props: TechnologyIncompleteProps) {
  return (
    <div className="TechnologyIncomplete" id="incomplete">
      <strong>Note:</strong> This project's overview requires more research and
      might not present accurate information. If you want to contribute you can{' '}
      <OutLink href={props.editLink}>edit the information on Github</OutLink>.{' '}
      {props.twitterLink && (
        <>
          Alternatively you{' '}
          <OutLink href={props.twitterLink}>
            contact the project team on Twitter
          </OutLink>{' '}
          and encourage them to contribute a PR.
        </>
      )}
    </div>
  )
}
