const pillars = [
  'Repository-first context',
  'Spec-driven workflow',
  'Human-in-the-loop decisions',
  'Least-privilege access model',
  'Deterministic validation gates',
];

const nextSteps = [
  'Caricare il progetto applicativo originale.',
  'Definire il primo task brief di sviluppo reale.',
  'Eseguire micro-task incrementali con SDD, ADR e review.',
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Euro American / HARNESS</p>
        <h1>Governance scaffold pronto per agenti Cursor</h1>
        <p className="lead">
          Questa prima versione web espone lo stato iniziale del repository HARNESS:
          regole Cursor, SDD, ADR, checklist, prompt e validazioni minime sono
          configurati per avviare lo sviluppo controllato del progetto reale.
        </p>
        <div className="status-grid" aria-label="Stato harness">
          <div>
            <span className="status-label">Validator</span>
            <strong>Passed</strong>
          </div>
          <div>
            <span className="status-label">MCP</span>
            <strong>A0/A1</strong>
          </div>
          <div>
            <span className="status-label">Accessi</span>
            <strong>Read-only by default</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h2>Pilastri operativi</h2>
          <ul>
            {pillars.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Prossimi step</h2>
          <ol>
            {nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
