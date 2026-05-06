import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Form, type FormValues } from '../decoder-new/form/Form'
import * as API from './api'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()
  if (!values) return <Form onSubmit={setValues} />
  if (values.hash && !values.data)
    return <FetchTx values={values} setValues={setValues} />
  return <DecodedWrapper values={values} />
}

export function FetchTx(props: {
  values: FormValues
  setValues(values: FormValues): void
}) {
  const query = useQuery({
    queryFn: () =>
      API.getTransaction({
        hash: props.values.hash as `0x${string}`,
        chainId: props.values.chainId || undefined,
      }),
    queryKey: [props.values.chainId, props.values.hash],
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (query.data) {
      props.setValues({
        address: query.data.to ?? '',
        chainId: query.data.chainId,
        data: query.data.data,
        hash: query.data.hash,
      })
    }
  }, [query.data])

  if (query.error) {
    return (
      <main className="mx-auto max-w-[900px] p-4 pb-20">
        <div className="text-red-500">Something went wrong :(</div>
      </main>
    )
  }

  if (query.data === null) {
    return (
      <main className="mx-auto max-w-[900px] p-4 pb-20">
        Transaction {props.values.hash} not found.
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <div className="text-zinc-500">Loading...</div>
    </main>
  )
}

function DecodedWrapper({ values }: { values: FormValues }) {
  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <pre>
        <code>{JSON.stringify(values, null, 2)}</code>
      </pre>
    </main>
  )
}
