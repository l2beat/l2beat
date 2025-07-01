import { useCallback, useEffect } from 'react'
import { useDiffSettingsStore } from '../../store'
import type { DiffViewProps } from '../DiffView'
import { splitCode } from '../utils/soliditySplitter'
import { useDiffState } from './useDiffState'
import { useLineSelection } from './useLineSelection'
import { useUrlState } from './useUrlState'

export function useDiffEditorSettings(props: DiffViewProps) {
  const {
    fold,
    removeUnchanged,
    removeComments,
    swapped,
    toggleFold,
    toggleRemoveUnchanged,
    toggleRemoveComments,
    toggleSwapped,
    setSettings,
  } = useDiffSettingsStore()

  const { queryParams, shareableUrl, buildShareableUrl, swapAddresses } =
    useUrlState()
  const { selection, initialSelection, setSelection, clearSelection } =
    useLineSelection(queryParams.lines)
  const { diff, setDiff, splitLeft, splitRight, leftAddress, rightAddress } =
    useDiffState(
      props.leftCode,
      props.rightCode,
      props.leftAddress,
      props.rightAddress,
      removeUnchanged,
      removeComments,
      swapped,
    )

  useEffect(() => {
    setSettings({
      removeUnchanged:
        queryParams.removeUnchanged ??
        !codeIsTheSame(props.leftCode, props.rightCode),
      removeComments: queryParams.removeComments ?? false,
      fold: queryParams.fold ?? false,
    })
  }, [
    queryParams.removeUnchanged,
    queryParams.removeComments,
    props.leftCode,
    props.rightCode,
    setSettings,
  ])

  useEffect(() => {
    buildShareableUrl(selection, removeUnchanged, removeComments, fold)
  }, [selection, removeUnchanged, removeComments, fold, buildShareableUrl])

  const wrappedToggleFold = useCallback(() => {
    toggleFold()
    clearSelection()
  }, [toggleFold, clearSelection])

  const wrappedToggleRemoveUnchanged = useCallback(() => {
    toggleRemoveUnchanged()
    clearSelection()
  }, [toggleRemoveUnchanged, clearSelection])

  const wrappedToggleRemoveComments = useCallback(() => {
    toggleRemoveComments()
    clearSelection()
  }, [toggleRemoveComments, clearSelection])

  const swapSides = useCallback(() => {
    swapAddresses(leftAddress, rightAddress)
    toggleSwapped()
    clearSelection()
  }, [swapAddresses, leftAddress, rightAddress, toggleSwapped, clearSelection])

  return {
    initialSelection,
    fold,
    removeUnchanged,
    removeComments,
    diff,
    url: shareableUrl,
    setSelection,
    toggleFold: wrappedToggleFold,
    toggleRemoveUnchanged: wrappedToggleRemoveUnchanged,
    toggleRemoveComments: wrappedToggleRemoveComments,
    setDiff,
    swapSides,
    leftAddress,
    rightAddress,
    splitLeft,
    splitRight,
  }
}

function codeIsTheSame(
  left: Record<string, string>,
  right: Record<string, string>,
): boolean {
  const [leftCode, rightCode] = splitCode(left, right)
  return leftCode === rightCode
}
