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

export const SIMULATION_WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

const padTimeUnit = (value) => String(value).padStart(2, '0');

const normalizeSimulationMinutes = (value) => {
  const totalMinutes = Number(value);
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
    return null;
  }

  return Math.floor(totalMinutes);
};

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

export const formatSimulationClock = (value) => {
  const wholeMinutes = normalizeSimulationMinutes(value);
  if (wholeMinutes === null) {
    return '未提供';
  }

  const weekIndex = Math.floor(wholeMinutes / MINUTES_PER_WEEK);
  const minutesOfWeek = wholeMinutes % MINUTES_PER_WEEK;
  const dayIndex = Math.floor(minutesOfWeek / MINUTES_PER_DAY);
  const minutesOfDay = minutesOfWeek % MINUTES_PER_DAY;
  const hour = Math.floor(minutesOfDay / MINUTES_PER_HOUR);
  const minute = minutesOfDay % MINUTES_PER_HOUR;
  const weekLabel = weekIndex > 0 ? `第${weekIndex + 1}週 ` : '';

  return `${weekLabel}${SIMULATION_WEEKDAYS[dayIndex]} ${padTimeUnit(hour)}:${padTimeUnit(minute)}`;
};

export const formatDuration = (value) => {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 0) {
    return '未提供';
  }

  const roundedMinutes = Math.round(minutes);
  if (roundedMinutes <= 0) {
    return '0 分';
  }

  const days = Math.floor(roundedMinutes / MINUTES_PER_DAY);
  const hours = Math.floor((roundedMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const remainingMinutes = roundedMinutes % MINUTES_PER_HOUR;
  const parts = [];

  if (days > 0) {
    parts.push(`${days} 天`);
  }

  if (hours > 0) {
    parts.push(`${hours} 小時`);
  }

  if (remainingMinutes > 0 || parts.length === 0) {
    parts.push(`${remainingMinutes} 分`);
  }

  return parts.join(' ');
};

export const getSimulationWeekdayIndex = (value) => {
  const wholeMinutes = normalizeSimulationMinutes(value);
  if (wholeMinutes === null) {
    return null;
  }

  const minutesOfWeek = wholeMinutes % MINUTES_PER_WEEK;
  return Math.floor(minutesOfWeek / MINUTES_PER_DAY);
};

export const getSimulationWeekdayLabel = (value) => {
  const dayIndex = getSimulationWeekdayIndex(value);
  return dayIndex === null ? '未提供' : SIMULATION_WEEKDAYS[dayIndex];
};

export const getEventTone = (eventType) => {
  if (eventType.includes('CT')) return 'tone-ct';
  if (eventType.includes('佇列')) return 'tone-queue';
  if (eventType.includes('開始')) return 'tone-start';
  if (eventType.includes('報告')) return 'tone-end';
  if (eventType.includes('結束')) return 'tone-end';
  if (eventType.includes('離院') || eventType.includes('抵達')) return 'tone-transition';
  return 'tone-default';
};
