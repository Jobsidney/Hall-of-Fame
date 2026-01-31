const stats = [
  { label: 'Energy sync', value: '98.7%' },
  { label: 'Armor response', value: '0.42s' },
  { label: 'Flight vectors', value: '12.4k' },
]

export function StatsStrip() {
  return (
    <section className="cinematic__stats" aria-label="Performance metrics">
      {stats.map((item) => (
        <div key={item.label} className="cinematic__stat">
          <span className="cinematic__stat-value">{item.value}</span>
          <span className="cinematic__stat-label">{item.label}</span>
        </div>
      ))}
    </section>
  )
}

