type AccentTone = 'magenta' | 'cyan' | 'violet'

export type StorySectionData = {
  id: string
  eyebrow: string
  title: string
  copy: string
  stat: string
  accent: AccentTone
}

type StorySectionProps = {
  data: StorySectionData
  index: number
  refCallback: (element: HTMLDivElement | null) => void
}

export function StorySection({ data, index, refCallback }: StorySectionProps) {
  return (
    <section
      id={data.id}
      ref={refCallback}
      className={`cinematic__section cinematic__section--${data.accent}`}
      aria-label={`Sequence ${index + 1}`}
    >
      <div className="cinematic__section-inner">
        <div className="cinematic__section-content" data-animate="content">
          <span className="cinematic__section-stat">{data.stat}</span>
          <p className="cinematic__eyebrow">{data.eyebrow}</p>
          <h3 className="cinematic__section-title">{data.title}</h3>
          <p className="cinematic__copy">{data.copy}</p>
          <a className="cinematic__link" href="#cinematic-content">
            Reset sequence
          </a>
        </div>
        <div className="cinematic__section-deco" data-animate="deco" aria-hidden="true">
          <span className="cinematic__deco-ring" />
          <span className="cinematic__deco-ring cinematic__deco-ring--outer" />
        </div>
      </div>
    </section>
  )
}

