import { OutLink } from '../../../common'
import { ShieldWarnIcon } from '../../../common/icons'
import { Section } from './Section'

export interface DescriptionSectionProps {
  editLink: string
  issueLink: string
  description: string
  warning?: string
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <Section
      title="Description"
      id="description"
      className="DescriptionSection"
      editLink={props.editLink}
      issueLink={props.issueLink}
    >
      {props.warning && (
        <div className="DescriptionSection-Warning">
          <ShieldWarnIcon />
          {props.warning}
        </div>
      )}
      <p className="DescriptionSection-Text">{props.description}</p>
    </Section>
  )
}
