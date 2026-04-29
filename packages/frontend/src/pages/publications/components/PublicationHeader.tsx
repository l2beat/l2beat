import type { ImageParams } from '~/utils/project/getImageParams'
import type { PublicationEntry } from '../utils/getPublicationEntry'
import { PublicationTag } from './PublicationsList'

export function PublicationHeader<
  T extends {
    title: string
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
      <div className="flex items-center gap-2">
        <PublicationTag tag={publication.tag} />
        <p className="text-brand text-subtitle-12 uppercase">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      </div>
      <h1 className="mt-2 text-heading-24 md:text-heading-32">
        {publication.title}
      </h1>
      <div className="mt-6 flex items-center justify-start">
        <img
          {...publication.author.avatar}
          alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
          className="mr-2 size-10 rounded-full"
        />
        <div>
          <p className="font-bold text-label-value-16">
            {publication.author.firstName} {publication.author.lastName}
          </p>
          {publication.author.role && (
            <p className="mt-1 font-bold text-label-value-12 text-zinc-500 dark:text-gray-50">
              {publication.author.role}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
