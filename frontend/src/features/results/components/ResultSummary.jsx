import MetricCard from '../../../components/MetricCard.jsx';
import { formatDateTime, formatInteger, formatNumber, formatPercent } from '../../../lib/formatters.js';

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
          來源：{sourceLabel}，建立時間 {formatDateTime(result.created_at)}
        </p>
      </div>

      <div className="summary-grid">
        <MetricCard label="病人總數" value={formatInteger(summary.total_patients)} />
        <MetricCard label="事件總數" value={formatInteger(summary.total_events)} />
        <MetricCard label="平均等待" value={`${formatNumber(summary.average_waiting_time)} 分`} />
        <MetricCard label="P95 等待" value={`${formatNumber(summary.p95_waiting_time)} 分`} />
        <MetricCard
          label="平均停留時間"
          value={`${formatNumber(summary.average_time_in_system)} 分`}
        />
        <MetricCard
          label="平均服務時間"
          value={`${formatNumber(summary.average_service_time)} 分`}
        />
      </div>

      <div className="utilization-wrap">
        {Object.entries(summary.resource_utilization || {}).map(([resource, value]) => (
          <div key={resource} className="utilization-row">
            <span className="utilization-label">{resource}</span>
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
