export const formatNumber = (num: number): string => {
  if (num == null || isNaN(num)) return '0';
  if (num >= 1000) {
    return num.toLocaleString('es-VE');
  }
  return num.toString();
};

export const formatGC = (gc: number): string => {
  if (gc == null || isNaN(gc)) return '0 GC';
  return `${formatNumber(gc)} GC`;
};

export const formatDistance = (meters: number): string => {
  if (meters == null || isNaN(meters)) return '0 m';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

export const formatCalories = (cal: number): string => {
  if (cal == null || isNaN(cal)) return '0 kcal';
  return `${formatNumber(cal)} kcal`;
};

export const formatMinutes = (minutes: number): string => {
  if (minutes == null || isNaN(minutes)) return '0 min';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  }
  return `${minutes} min`;
};

export const formatTimeAgo = (date: Date | string): string => {
  if (!date) return '';
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || isNaN(d.getTime())) return '';
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return d.toLocaleDateString('es-VE');
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-VE', {
    day: 'numeric',
    month: 'short',
  });
};

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DAY_NAMES_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const getDayName = (date: Date, short = true): string => {
  return short ? DAY_NAMES[date.getDay()] : DAY_NAMES_FULL[date.getDay()];
};
