import MetricCard from '../../../components/MetricCard.jsx';
import {
  formatDateTime,
  formatDuration,
  formatInteger,
  formatPercent,
} from '../../../lib/formatters.js';

const RESOURCE_LABELS = {
  doctors: '醫師',
  ct: 'CT',
  xray: 'Xray',
  lab: 'Lab',
  ultrasound: 'Ultrasound',
};

function ResultSummary({ result, sourceLabel }) {
  const summary = result?.summary;

  if (!summary) {
    return null;
  }

  const artifacts = Object.entries(result.artifacts || {});

  return (
    <section className="panel-card">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Results</p>
          <h2 className="panel-title">模擬摘要</h2>
        </div>
        <p className="panel-copy">
          來源：{sourceLabel}，建立時間 {formatDateTime(result.created_at)}。P95 等待代表 95% 病人的等待時間不會超過這個值。
        </p>
      </div>

      <div className="summary-grid">
        <MetricCard label="病人總數" value={formatInteger(summary.total_patients)} />
        <MetricCard label="事件總數" value={formatInteger(summary.total_events)} />
        <MetricCard label="平均等待" value={formatDuration(summary.average_waiting_time)} />
        <MetricCard label="P95 等待" value={formatDuration(summary.p95_waiting_time)} />
        <MetricCard
          label="平均在院時間"
          value={formatDuration(summary.average_time_in_system)}
        />
        <MetricCard
          label="平均服務時間"
          value={formatDuration(summary.average_service_time)}
        />
      </div>

      <div className="utilization-wrap">
        {Object.entries(summary.resource_utilization || {}).map(([resource, value]) => (
          <div key={resource} className="utilization-row">
            <span className="utilization-label">{RESOURCE_LABELS[resource] || resource}</span>
            <div className="utilization-bar">
              <span className="utilization-fill" style={{ width: `${Math.min(value * 100, 100)}%` }} />
            </div>
            <span className="utilization-value">{formatPercent(value)}</span>
          </div>
        ))}
      </div>

      {artifacts.length > 0 ? (
        <div className="artifact-row">
          {artifacts.map(([label, url]) => (
            <a key={label} className="artifact-link" href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ResultSummary;
