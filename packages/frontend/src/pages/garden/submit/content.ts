/** What a project needs before a review is even possible. */
export const GROUND_RULES = [
  'The protocol is live, with real users.',
  'It can be reviewed from public sources: verified contracts, published source, docs.',
  'There is someone who can answer our questions, unless the protocol is completely ownerless.',
]

/** The submission process, start to finish. */
export const PROCESS_STEPS = [
  {
    title: 'Send us the details',
    description:
      'A few minutes of to fill in the template and create a forum post.',
  },
  {
    title: 'We check that it fits',
    description: 'We confirm it is live and reviewable from public sources.',
  },
  {
    title: 'We review it',
    description:
      'We review based on onchain data and the provided sources, and come up with a conclusion. If it is CROPS-y enough, it will be added to the garden. If not, you will get the feedback in the forum.',
  },
  {
    title: 'We monitor and stay open for feedback',
    description:
      'Any changes might affect the assessment, and opinions are welcome in the forum.',
  },
]
