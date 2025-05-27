import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { DecodedView } from './View'
import { Form } from './form/Form'
import { callDecode } from './form/api'

export function DecoderApp() {
  const [search] = useSearchParams()
  if (search.size !== 0) {
    return <DecodedWrapper search={search} />
  }
  return <Form />
}

function DecodedWrapper({ search }: { search: URLSearchParams }) {
  const result = useQuery({
    queryFn: () => callDecode(search.toString()),
    queryKey: [search.toString()],
  })

  if (result.isPending) {
    return <div className="text-zinc-500">Decoding...</div>
  }

  if (result.error) {
    return <div className="text-red-500">Something went wrong :(</div>
  }

  return <DecodedView decoded={result.data} />
}
