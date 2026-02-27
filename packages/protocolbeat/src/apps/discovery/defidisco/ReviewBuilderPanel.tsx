import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getReviewConfig, updateReviewConfig } from '../../../api/api'
import type {
  ReviewConfig,
  ReviewContentBlock,
  ReviewProjectType,
  ReviewSection,
  ReviewSubSection,
} from '../../../api/types'
import {
  AVAILABLE_PROJECT_TYPES,
  getReviewTemplate,
} from './reviewBuilderTemplates'
import { registerPanelDirtyCheck } from './panelDirtyState'
import { ReviewSectionEditor } from './ReviewSectionEditor'
import { ReviewDataKeysEditor } from './ReviewDataKeysEditor'
import { ReviewDescriptionsEditor } from './ReviewDescriptionsEditor'
import { useReviewImportData } from './useReviewImportData'

const SECTION_KEYS = ['codeAndAudits'] as const
type SectionKey = (typeof SECTION_KEYS)[number]

type TabKey = SectionKey | 'descriptions'

const TAB_LABELS: Record<TabKey, string> = {
  descriptions: 'Descriptions',
  codeAndAudits: 'Code & Audits',
}

const ALL_TABS: TabKey[] = ['descriptions', ...SECTION_KEYS]

export function ReviewBuilderPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['review-config', project],
    queryFn: () => getReviewConfig(project),
  })

  const [localConfig, setLocalConfig] = useState<ReviewConfig | null>(null)
  const [savedJson, setSavedJson] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('descriptions')

  const { data: importData, isLoading: isImportDataLoading } =
    useReviewImportData(project)

  useEffect(() => {
    if (data?.config && localConfig === null) {
      setLocalConfig(data.config)
      setSavedJson(JSON.stringify(data.config))
    }
  }, [data, localConfig])

  const isDirty = useMemo(() => {
    if (!localConfig) return false
    return JSON.stringify(localConfig) !== savedJson
  }, [localConfig, savedJson])

  // Register dirty check so PanelHeader can prompt before switching/closing
  const isDirtyRef = useRef(isDirty)
  isDirtyRef.current = isDirty
  useEffect(() => {
    return registerPanelDirtyCheck('review', () => isDirtyRef.current)
  }, [])

  const handleSave = useCallback(async () => {
    if (!localConfig) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateReviewConfig(project, localConfig)
      setSavedJson(JSON.stringify(localConfig))
      await queryClient.invalidateQueries({
        queryKey: ['review-config', project],
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [localConfig, project, queryClient])

  const handleTemplateSelect = useCallback(
    (projectType: ReviewProjectType) => {
      const template = getReviewTemplate(projectType)
      template.protocolSlug = project
      setLocalConfig(template)
    },
    [project],
  )

  const updateMetadata = useCallback(
    (
      field: keyof Pick<
        ReviewConfig,
        'protocolSlug' | 'protocolName' | 'tokenName' | 'chain'
      >,
      value: string,
    ) => {
      setLocalConfig((prev) => {
        if (!prev) return prev
        return { ...prev, [field]: value }
      })
    },
    [],
  )

  const updateSection = useCallback(
    (
      sectionKey: SectionKey,
      updater: (section: ReviewSection) => ReviewSection,
    ) => {
      setLocalConfig((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          sections: {
            ...prev.sections,
            [sectionKey]: updater(prev.sections[sectionKey]),
          },
        }
      })
    },
    [],
  )

  const updateDataKeys = useCallback((dataKeys: Record<string, string>) => {
    setLocalConfig((prev) => {
      if (!prev) return prev
      return { ...prev, dataKeys }
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    )
  }

  // No config exists yet — show template selector
  if (!localConfig) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
        <h2 className="font-bold text-lg text-autumn-300">
          Create a New Review
        </h2>
        <p className="text-coffee-200 text-sm">
          Select a project type to start from a template:
        </p>
        <div className="flex gap-2">
          {AVAILABLE_PROJECT_TYPES.map((pt) => (
            <button
              key={pt}
              onClick={() => handleTemplateSelect(pt)}
              className="rounded bg-autumn-300 px-4 py-2 text-sm font-medium text-coffee-900 hover:bg-autumn-200"
            >
              {pt.charAt(0).toUpperCase() + pt.slice(1)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      {/* Header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-coffee-600 px-2 py-1">
        <span className="font-bold text-autumn-300">Review Builder</span>
        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-xs text-red-400">{saveError}</span>
          )}
          {isDirty && !saving && (
            <span className="text-xs text-yellow-400">Unsaved changes</span>
          )}
          {!isDirty && !saving && savedJson && (
            <span className="text-xs text-green-400">Saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`rounded px-3 py-1 text-xs font-medium ${
              isDirty && !saving
                ? 'bg-autumn-300 text-coffee-900 hover:bg-autumn-200'
                : 'bg-coffee-700 text-coffee-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="overflow-auto p-2">
        {/* Metadata form */}
        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <label className="w-20 text-xs text-coffee-200">Type</label>
            <span className="rounded bg-coffee-700 px-2 py-0.5 text-xs text-autumn-300">
              {localConfig.projectType}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetadataField
              label="Slug"
              value={localConfig.protocolSlug}
              onChange={(v) => updateMetadata('protocolSlug', v)}
            />
            <MetadataField
              label="Name"
              value={localConfig.protocolName}
              onChange={(v) => updateMetadata('protocolName', v)}
            />
            <MetadataField
              label="Token"
              value={localConfig.tokenName}
              onChange={(v) => updateMetadata('tokenName', v)}
            />
            <MetadataField
              label="Chain"
              value={localConfig.chain}
              onChange={(v) => updateMetadata('chain', v)}
            />
          </div>
        </div>

        {/* Section tabs */}
        <div className="mb-2 flex border-b border-coffee-600">
          {ALL_TABS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 text-xs font-medium ${
                activeTab === key
                  ? 'border-b-2 border-autumn-300 text-autumn-300'
                  : 'text-coffee-200 hover:text-coffee-100'
              }`}
            >
              {TAB_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {activeTab === 'descriptions' ? (
          <ReviewDescriptionsEditor
            project={project}
            config={localConfig}
            onUpdateConfig={(updater) =>
              setLocalConfig((prev) => (prev ? updater(prev) : prev))
            }
          />
        ) : (
          <ReviewSectionEditor
            section={localConfig.sections[activeTab]}
            onChange={(updater) => updateSection(activeTab, updater)}
            sectionKey={activeTab}
            importData={importData}
            isDataLoading={isImportDataLoading}
          />
        )}

        {/* Data keys editor */}
        <div className="mt-4 border-t border-coffee-600 pt-3">
          <ReviewDataKeysEditor
            dataKeys={localConfig.dataKeys}
            onChange={updateDataKeys}
          />
        </div>
      </div>
    </div>
  )
}

function MetadataField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <label className="text-xs text-coffee-200">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-coffee-600 bg-coffee-800 px-2 py-0.5 text-xs text-coffee-100 focus:border-autumn-300 focus:outline-none"
        placeholder={label.toLowerCase()}
      />
    </div>
  )
}
