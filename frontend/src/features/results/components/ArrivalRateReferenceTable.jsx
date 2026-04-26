import { ARRIVAL_RATE_REFERENCE_DAYS, ARRIVAL_RATE_REFERENCE_ROWS } from '../data/arrivalRateReference.js';
import { formatNumber } from '../../../lib/formatters.js';

function ArrivalRateReferenceTable() {
  return (
    <section className="panel-card">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Paper Reference</p>
          <h2 className="panel-title">論文到診率參考表</h2>
        </div>
        <p className="panel-copy">
          下表整理論文 Table 2 的每週 24 小時平均到診率；目前這版 NHPP 模型已直接使用這組時段到診率。
        </p>
      </div>

      <div className="reference-summary">
        <span className="reference-chip">論文 NHPP 基準</span>
        <span className="reference-caption">高峰通常落在 19:00-21:00，凌晨 04:00-05:00 為低谷。</span>
      </div>

      <div className="table-wrap">
        <table className="log-table reference-table">
          <thead>
            <tr>
              <th>時段</th>
              {ARRIVAL_RATE_REFERENCE_DAYS.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ARRIVAL_RATE_REFERENCE_ROWS.map((row) => (
              <tr key={row.hourLabel}>
                <td className="mono-cell time-range-cell">{row.hourLabel}</td>
                {row.rates.map((rate, index) => (
                  <td key={`${row.hourLabel}-${ARRIVAL_RATE_REFERENCE_DAYS[index]}`} className="mono-cell">
                    {formatNumber(rate)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ArrivalRateReferenceTable;
