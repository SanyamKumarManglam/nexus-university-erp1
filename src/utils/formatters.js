export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export function formatPercent(val) {
  if (val === null || val === undefined) return '0%';
  return `${Math.round(Number(val))}%`;
}

export function getRiskLevel(score) {
  const num = Number(score) || 0;
  if (num >= 80) return { label: 'Healthy', color: 'success', status: 'healthy' };
  if (num >= 60) return { label: 'Monitor', color: 'warning', status: 'monitor' };
  if (num >= 40) return { label: 'At Risk', color: 'danger', status: 'at_risk' };
  return { label: 'Critical', color: 'danger', status: 'critical' };
}

export function getInitials(name) {
  if (!name) return 'NX';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
