import { ProjectLinks } from '@l2beat/config'
import React from 'react'

import { LinkSectionLinks } from './LinkSectionLinks'

export interface LinkSectionProps {
  links: ProjectLinks
  icon: string
  name: string
}

export function LinkSection(props: LinkSectionProps) {
  return (
    <section className="LinkSection">
      <img
        className="LinkSection-Logo"
        src={props.icon}
        alt={`${props.name} logo`}
      />
      <h2 id="links" className="LinkSection-Name">
        {props.name}
      </h2>
      <table className="LinkSection-Table">
        <tbody>
          <LinkSectionLinks name="Website" links={props.links.websites} />
          <LinkSectionLinks
            name="Social media"
            links={props.links.socialMedia}
            social
          />
          <LinkSectionLinks name="App" links={props.links.apps} />
          <LinkSectionLinks
            name="Documentation"
            links={props.links.documentation}
          />
          <LinkSectionLinks name="Explorer" links={props.links.explorers} />
          <LinkSectionLinks
            name="Source code"
            links={props.links.repositories}
          />
        </tbody>
      </table>
    </section>
  )
}
