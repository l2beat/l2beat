import type { ImageParams } from '~/utils/project/getImageParams'
import type { PublicationEntry } from '../utils/getPublicationEntry'
import { PublicationTag } from './PublicationTag'

export function PublicationHeader<
  T extends {
    title: string
    description: string | undefined
    readTimeInMinutes: number
    author: {
      avatar: ImageParams
      firstName: string
      lastName: string
      role: string | undefined
    }
    publishedOn: string
    tag: PublicationEntry['tag']
  },
>({ publication }: { publication: T }) {
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-1 text-label-value-13">
        <PublicationTag tag={publication.tag} />
        <span className="text-secondary">·</span>
        <span className="text-secondary">
          {publication.readTimeInMinutes} min read · Published on{' '}
          {publication.publishedOn}
        </span>
      </p>
      <h1 className="mt-3 font-semibold text-heading-24 tracking-[-0.02em] md:text-heading-32">
        {publication.title}
      </h1>
      {publication.description && (
        <p className="mt-3 font-inter text-xl leading-[1.6] opacity-80">
          {publication.description}
        </p>
      )}
      <div className="mt-6 flex items-center justify-start">
        <img
          {...publication.author.avatar}
          alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
          className="mr-2 size-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-label-value-15">
            {publication.author.firstName} {publication.author.lastName}
          </p>
          {publication.author.role && (
            <p className="mt-1 text-label-value-13 text-secondary">
              {publication.author.role}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
