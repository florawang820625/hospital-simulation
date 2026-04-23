export const formatNumber = (value, digits = 2) =>
  new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);

export const formatInteger = (value) =>
  new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatPercent = (value) =>
  new Intl.NumberFormat('zh-TW', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

export const formatDateTime = (value) => {
  if (!value) {
    return '未建立';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getEventTone = (eventType) => {
  if (eventType.includes('CT')) return 'tone-ct';
  if (eventType.includes('佇列')) return 'tone-queue';
  if (eventType.includes('開始')) return 'tone-start';
  if (eventType.includes('結束')) return 'tone-end';
  if (eventType.includes('離開') || eventType.includes('抵達')) return 'tone-transition';
  return 'tone-default';
};
