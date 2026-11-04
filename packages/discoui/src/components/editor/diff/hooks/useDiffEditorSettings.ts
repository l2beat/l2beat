import { useCallback, useEffect } from 'react'
import { useDiffSettingsStore } from '../../store'
import { useDiffState } from './useDiffState'
import { useLineSelection } from './useLineSelection'
import { useUrlState } from './useUrlState'

type UseDiffEditorSettingsProps = {
  leftCode: Record<string, string>
  rightCode: Record<string, string>
  leftAddress: string
  rightAddress: string
}

export function useDiffEditorSettings(props: UseDiffEditorSettingsProps) {
  const {
    fold,
    removeUnchanged,
    ignoreComments,
    swapped,
    toggleFold,
    toggleRemoveUnchanged,
    toggleIgnoreComments,
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
      ignoreComments,
      swapped,
    )

  useEffect(() => {
    setSettings({
      removeUnchanged: queryParams.removeUnchanged,
      ignoreComments: queryParams.ignoreComments,
      fold: queryParams.fold,
    })
  }, [
    queryParams.removeUnchanged,
    queryParams.ignoreComments,
    queryParams.fold,
    props.leftCode,
    props.rightCode,
    setSettings,
  ])

  useEffect(() => {
    buildShareableUrl(selection, removeUnchanged, ignoreComments, fold)
  }, [selection, removeUnchanged, ignoreComments, fold, buildShareableUrl])

  const wrappedToggleFold = useCallback(() => {
    toggleFold()
    clearSelection()
  }, [toggleFold, clearSelection])

  const wrappedToggleRemoveUnchanged = useCallback(() => {
    toggleRemoveUnchanged()
    clearSelection()
  }, [toggleRemoveUnchanged, clearSelection])

  const wrappedToggleIgnoreComments = useCallback(() => {
    toggleIgnoreComments()
    clearSelection()
  }, [toggleIgnoreComments, clearSelection])

  const swapSides = useCallback(() => {
    swapAddresses(leftAddress, rightAddress)
    toggleSwapped()
    clearSelection()
  }, [swapAddresses, leftAddress, rightAddress, toggleSwapped, clearSelection])

  return {
    initialSelection,
    fold,
    removeUnchanged,
    ignoreComments,
    diff,
    url: shareableUrl,
    setSelection,
    toggleFold: wrappedToggleFold,
    toggleRemoveUnchanged: wrappedToggleRemoveUnchanged,
    toggleIgnoreComments: wrappedToggleIgnoreComments,
    setDiff,
    swapSides,
    leftAddress,
    rightAddress,
    splitLeft,
    splitRight,
  }
}
