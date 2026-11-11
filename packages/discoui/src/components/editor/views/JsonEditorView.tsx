import { json } from '../languages/json'
import { EditorView, type EditorViewProps } from './EditorView'

export function JsonEditorView(props: EditorViewProps) {
  return <EditorView {...props} json={json} />
}
