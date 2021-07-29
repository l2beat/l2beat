import { OutLink } from '../../../common'

interface Props {
  editLink: string
  issueLink?: string
}

export function EditLinks({ editLink, issueLink }: Props) {
  return (
    <div className="EditLinks ">
      <OutLink className="EditLinks-Link" href={editLink}>
        [Edit]
      </OutLink>
      {issueLink && (
        <OutLink className="EditLinks-Link" href={issueLink}>
          [Issue]
        </OutLink>
      )}
    </div>
  )
}
