const TONE_CLASS = {
  info: 'status-card',
  success: 'status-card status-success',
  warning: 'status-card status-warning',
  error: 'status-card status-error',
};

function StatusBanner({ tone = 'info', children }) {
  return <div className={TONE_CLASS[tone] || TONE_CLASS.info}>{children}</div>;
}

export default StatusBanner;
