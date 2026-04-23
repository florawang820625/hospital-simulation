import { useDeferredValue, useMemo, useState } from 'react';
import { formatInteger, formatNumber, getEventTone } from '../../../lib/formatters.js';

function EventLogTable({ logs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const eventTypes = useMemo(
    () => Array.from(new Set((logs || []).map((log) => log.event_type))).sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const keyword = deferredSearchTerm.trim().toLowerCase();
    return (logs || []).filter((log) => {
      const matchesSearch =
        keyword.length === 0 ||
        [
          log.patient,
          log.triage_level,
          log.event_type,
          log.resource,
          log.desc,
        ].some((value) => String(value || '').toLowerCase().includes(keyword));

      const matchesFilter =
        activeFilters.length === 0 || activeFilters.includes(log.event_type);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilters, deferredSearchTerm, logs]);

  return (
    <section className="panel-card">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Event Log</p>
          <h2 className="panel-title">事件明細</h2>
        </div>
        <p className="panel-copy">
          目前顯示 {formatInteger(filteredLogs.length)} / {formatInteger(logs?.length || 0)} 筆事件。
        </p>
      </div>

      <div className="toolbar">
        <label className="search-block">
          <span className="field-label">搜尋事件</span>
          <input
            className="search-input"
            type="text"
            placeholder="搜尋病人、事件名稱、資源或描述"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <button
          className="ghost-button"
          type="button"
          onClick={() => {
            setSearchTerm('');
            setActiveFilters([]);
          }}
        >
          清除篩選
        </button>
      </div>

      <div className="filter-row">
        {eventTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={`filter-chip ${activeFilters.includes(type) ? 'is-active' : ''}`}
            onClick={() =>
              setActiveFilters((current) =>
                current.includes(type)
                  ? current.filter((item) => item !== type)
                  : [...current, type]
              )
            }
          >
            {type}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>時間</th>
              <th>事件</th>
              <th>病人</th>
              <th>檢傷</th>
              <th>等待</th>
              <th>離院</th>
              <th>系統停留</th>
              <th>資源</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={`${log.patient}-${log.timestamp}-${index}`}>
                <td className="mono-cell">{formatNumber(log.timestamp)}</td>
                <td>
                  <span className={`event-badge ${getEventTone(log.event_type)}`}>
                    {log.event_type}
                  </span>
                </td>
                <td className="mono-cell">{log.patient}</td>
                <td>{log.triage_level}</td>
                <td className="mono-cell">{formatNumber(log.waiting_time)}</td>
                <td className="mono-cell">{formatNumber(log.departure_clock)}</td>
                <td className="mono-cell">{formatNumber(log.time_in_system)}</td>
                <td>{log.resource}</td>
                <td>{log.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 ? (
          <div className="empty-state">沒有符合目前搜尋或篩選條件的事件。</div>
        ) : null}
      </div>
    </section>
  );
}

export default EventLogTable;
