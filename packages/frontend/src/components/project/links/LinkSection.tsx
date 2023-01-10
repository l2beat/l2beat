import { ProjectLinks } from '@l2beat/config'
import React from 'react'

import { LinkSectionLinks } from './LinkSectionLinks'

export interface LinkSectionProps {
  icon: string
  name: string
  links: ProjectLinks
}

export function LinkSection(props: LinkSectionProps) {
  return (
    <section className="px-4 py-3 md:p-0 md:bg-gray-100 md:dark:bg-gray-900 md:rounded-lg md:mt-6">
      <div className="hidden my-6 px-6 md:flex items-center">
        <img
          src={props.icon}
          alt={`${props.name} logo`}
          className="inline-block w-8 h-8"
        />
        <h2 id="links" className="inline ml-4 text-2xl font-bold">
          {props.name}
        </h2>
      </div>

      <table className="text-left text-xs w-full table-fixed border-collapse">
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
