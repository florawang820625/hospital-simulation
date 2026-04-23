function ScenarioSelector({ scenarios, selectedSlug, onChange, disabled }) {
  return (
    <section className="panel-card">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Scenarios</p>
          <h2 className="panel-title">樣本情境</h2>
        </div>
        <p className="panel-copy">先用固定場景快速檢視結果，再決定要不要送出即時模擬。</p>
      </div>

      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <button
            key={scenario.slug}
            type="button"
            className={`scenario-card ${selectedSlug === scenario.slug ? 'is-active' : ''}`}
            onClick={() => onChange(scenario.slug)}
            disabled={disabled}
          >
            <span className="scenario-title">{scenario.title}</span>
            <span className="scenario-description">{scenario.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ScenarioSelector;
