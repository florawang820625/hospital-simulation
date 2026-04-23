const FIELD_CONFIG = [
  { key: 'num_doctors', label: '醫師數量', min: 1, step: 1 },
  { key: 'num_nurses', label: '護理師數量', min: 1, step: 1 },
  { key: 'num_ct', label: 'CT 資源數', min: 0, step: 1 },
  { key: 'num_xray', label: 'Xray 資源數', min: 0, step: 1 },
  { key: 'num_lab', label: 'Lab 資源數', min: 0, step: 1 },
  { key: 'simulation_time', label: '模擬分鐘數', min: 60, step: 60 },
  { key: 'exam_probability', label: '檢查機率', min: 0, max: 1, step: 0.05 },
  { key: 'random_seed', label: '隨機種子', min: 0, step: 1 },
];

function SimulationForm({
  values,
  onFieldChange,
  onSubmit,
  disabled,
  apiAvailable,
}) {
  return (
    <section className="panel-card">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Simulation</p>
          <h2 className="panel-title">即時模擬參數</h2>
        </div>
        <p className="panel-copy">
          這一層只負責收集參數並送到 FastAPI。沒有後端時，畫面會自動退回樣本資料模式。
        </p>
      </div>

      <div className="form-grid">
        {FIELD_CONFIG.map((field) => (
          <label key={field.key} className="field-group">
            <span className="field-label">{field.label}</span>
            <input
              className="field-input"
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.key]}
              disabled={disabled}
              onChange={(event) => {
                const nextValue = field.key === 'exam_probability'
                  ? Number(event.target.value)
                  : Number.parseInt(event.target.value || '0', 10);
                onFieldChange(field.key, Number.isNaN(nextValue) ? field.min ?? 0 : nextValue);
              }}
            />
          </label>
        ))}
      </div>

      <div className="form-actions">
        <button className="primary-button" type="button" onClick={onSubmit} disabled={disabled}>
          {disabled ? '模擬執行中...' : '執行模擬'}
        </button>
        <span className="form-hint">
          {apiAvailable ? '已連到 FastAPI 服務。' : '目前使用樣本模式，執行會退回情境結果。'}
        </span>
      </div>
    </section>
  );
}

export default SimulationForm;
