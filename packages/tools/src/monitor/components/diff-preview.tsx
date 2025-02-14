import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'

export function DiffPreview({ diff }: { diff: string }) {
  return (
    <SyntaxHighlighter
      language="diff"
      style={vscDarkPlus}
      showLineNumbers
      wrapLines
      wrapLongLines
      customStyle={{
        borderRadius: '0.3rem',
        cursor: 'text',
      }}
      lineProps={(lineNumber) => {
        const line = diff.split('\n')[lineNumber - 1]
        return {
          style: {
            whiteSpace: 'pre-wrap',
            display: 'block',
            backgroundColor: line?.startsWith('+')
              ? '#182618'
              : line?.startsWith('-')
                ? '#261818'
                : 'inherit',
          },
        }
      }}
    >
      {diff}
    </SyntaxHighlighter>
  )
}
