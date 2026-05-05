import { useState } from 'react'
import { Form, FormValues } from '../decoder-new/form/Form'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()
  if (values) return <DecodedWrapper values={values} />
  return <Form onSubmit={setValues} />
}

function DecodedWrapper({ values }: { values: FormValues }) {
  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      Hello World!
      <pre><code>
        {JSON.stringify(values)}
        </code></pre>
    </main>
  )
}
