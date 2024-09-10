import { Prisma, PrismaClient as VanillaPrismaClient } from '@prisma/client'
import pick from 'lodash/pick.js'
import { env } from '../env.js'
import { chunkUpsert } from '../utils/chunkUpsert.js'

export const createPrismaClient = () =>
  new VanillaPrismaClient({
    log: !env.PRISMA_QUERY_LOG
      ? ['warn', 'error']
      : ['query', 'info', 'warn', 'error'],
  }).$extends({
    // This is an extension which hacks in upsertMany for Prisma
    model: {
      $allModels: {
        // https://github.com/prisma/prisma/issues/4134
        async upsertMany<T>(
          this: T,
          {
            data,
            conflictPaths,
            typeCast,
          }: {
            data: Prisma.Args<T, 'createMany'>['data']
            conflictPaths: (keyof Prisma.Args<T, 'create'>['data'])[]
            // https://github.com/prisma/prisma/issues/10252
            typeCast?: {
              [P in keyof Prisma.Args<T, 'create'>['data']]?: string
            }
          },
        ): Promise<number> {
          data = Array.isArray(data) ? data : [data]
          if (data.length === 0) {
            return 0
          }

          const context = Prisma.getExtensionContext(this)

          const model = Prisma.dmmf.datamodel.models.find(
            (model) => model.name === context.$name,
          )
          if (!model) {
            throw new Error('No model')
          }

          const tableArg = Prisma.raw(`"${model.dbName || model.name}"`)

          // We don't want to upsert createdAt, nor generated or relation fields
          const writeableFields = model.fields.filter(
            (field) =>
              !['createdAt'].includes(field.name) &&
              !field.relationName &&
              !field.isGenerated,
          )

          const columns = writeableFields.map((field) => field.name)

          const columnsArg = Prisma.raw(columns.map((c) => `"${c}"`).join(','))

          const conflictArg = Prisma.raw(
            conflictPaths.map((c) => `"${String(c)}"`).join(','),
          )

          // Apart from the conflict paths, we want to update all columns except id (should make this configurable though)
          const updateColumns = columns.filter(
            (c) => !conflictPaths.includes(c) && c !== 'id',
          )
          const updateArg = Prisma.raw(
            updateColumns.map((c) => `"${c}" = EXCLUDED."${c}"`).join(','),
          )

          // We chunk the upserts to:
          // - avoid hitting the max prepared statement values limit
          // - avoid two upserts with the same conflict key in the same query (would result in a failed query)
          const chunked = chunkUpsert<Prisma.Args<T, 'createMany'>['data']>(
            data,
            (elem) => JSON.stringify(pick(elem, conflictPaths)),
            // This is the chunk size (works for now, but should be calculated based on the number of columns and the max prepared statement values limit)
            500,
          )

          let count = 0

          // NOTE: we're running the queries sequentially WITHOUT a transaction,
          // so if one fails, the previous ones will still be committed. The problems are:
          // 1/ Prisma doesn't let us run nested transactions, so creating a new one might not work
          // 2/ it takes a lot of time to run a transaction so the timeout and lock time would have to be huge

          for (const chunk of chunked) {
            // biome-ignore lint/suspicious/noExplicitAny: intentional
            const values = (chunk as any[]).map(
              (d) =>
                Prisma.sql`(${Prisma.join(
                  writeableFields.map((field) => {
                    if (field.isUpdatedAt) {
                      return Prisma.sql`CURRENT_TIMESTAMP`
                    }

                    const column = field.name
                    const cast = typeCast && typeCast[column]
                    if (cast) {
                      return Prisma.sql`${d[column]}::${Prisma.raw(cast)}`
                    }

                    return d[column]
                  }),
                )})`,
            )

            if (updateColumns.length > 0) {
              // biome-ignore lint/suspicious/noExplicitAny: intentional
              count += await (context.$parent as any).$executeRaw`
                INSERT INTO ${tableArg} (${columnsArg})
                VALUES ${Prisma.join(values)}
                ON CONFLICT (${conflictArg}) DO UPDATE SET
                  ${updateArg};`
            } else {
              // biome-ignore lint/suspicious/noExplicitAny: intentional
              count += await (context.$parent as any).$executeRaw`
                INSERT INTO ${tableArg} (${columnsArg})
                VALUES ${Prisma.join(values)}
                ON CONFLICT (${conflictArg}) DO NOTHING;`
            }
          }

          // We return the number of upserted rows
          return count
        },
      },
    },
  })

export type PrismaClient = ReturnType<typeof createPrismaClient>
