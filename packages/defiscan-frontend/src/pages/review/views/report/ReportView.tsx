import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import type { CompiledReview } from '../../../../types'
import { KeyFindings } from './KeyFindings'
import { AdminCards } from './AdminCards'
import { FundCards } from './FundCards'
import { DependencyCards } from './DependencyCards'
import { CodeSection } from './CodeSection'

interface ReportViewProps {
  review: CompiledReview
}

interface SectionDef {
  id: string
  title: string
}

const SECTIONS: SectionDef[] = [
  { id: 'summary', title: 'Summary' },
  { id: 'key-findings', title: 'Key Findings' },
  { id: 'funds', title: 'What Is at Stake?' },
  { id: 'admins', title: 'Who Is in Control?' },
  { id: 'dependencies', title: 'What Does It Depend On?' },
  { id: 'code', title: 'More Information' },
]

export function ReportView({ review }: ReportViewProps) {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0]?.id ?? 'key-findings')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Create the IntersectionObserver once on mount
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0 && visible[0]) {
          const id = visible[0].target.getAttribute('data-section-id')
          if (id) {
            setActiveSection(id)
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    )

    return () => observerRef.current?.disconnect()
  }, [])

  // Register elements with the observer as they mount via ref callbacks
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  function registerRef(id: string, el: HTMLElement | null) {
    const observer = observerRef.current
    if (el) {
      sectionRefs.current.set(id, el)
      observer?.observe(el)
    } else {
      const prev = sectionRefs.current.get(id)
      if (prev) observer?.unobserve(prev)
      sectionRefs.current.delete(id)
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Sticky section navigation bar */}
      <nav className="mt-10 sticky top-0 z-40 -mx-4 px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                activeSection === section.id
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-text-secondary hover:text-purple-600 hover:bg-purple-50',
              )}
              onClick={(e) => {
                e.preventDefault()
                const el = sectionRefs.current.get(section.id)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Story sections -- generous spacing for readability */}
      <div className="mt-10 space-y-16">
        <section
          id="summary"
          data-section-id="summary"
          className="scroll-mt-20"
          ref={(el) => registerRef('summary', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Summary
          </h2>
          {review.metadata.description && (
            <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
              {review.metadata.description}
            </p>
          )}
        </section>

        <section
          id="key-findings"
          data-section-id="key-findings"
          className="scroll-mt-20"
          ref={(el) => registerRef('key-findings', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Key Findings
          </h2>
          <KeyFindings review={review} />
        </section>

        <section
          id="funds"
          data-section-id="funds"
          className="scroll-mt-20"
          ref={(el) => registerRef('funds', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            What Is at Stake?
          </h2>
          <FundCards review={review} />
        </section>

        <section
          id="admins"
          data-section-id="admins"
          className="scroll-mt-20"
          ref={(el) => registerRef('admins', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Who Is in Control?
          </h2>
          <AdminCards review={review} />
        </section>

        <section
          id="dependencies"
          data-section-id="dependencies"
          className="scroll-mt-20"
          ref={(el) => registerRef('dependencies', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            What Does It Depend On?
          </h2>
          <DependencyCards review={review} />
        </section>

        <section
          id="code"
          data-section-id="code"
          className="scroll-mt-20"
          ref={(el) => registerRef('code', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            More Information
          </h2>
          <CodeSection review={review} />
        </section>
      </div>
    </article>
  )
}
