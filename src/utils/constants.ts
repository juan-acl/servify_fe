const URGENCY_OPTIONS = [
  {
    value: "EMERGENCY",
    icon: "🔴",
    label: "Emergencia",
    description: "Necesito ayuda ahora mismo",
    time: "Expira en 30 min",
  },
  {
    value: "TODAY",
    icon: "🟡",
    label: "Hoy",
    description: "Lo necesito en las próximas horas",
    time: "Expira en 2 horas",
  },
  {
    value: "SCHEDULED",
    icon: "🔵",
    label: "Programado",
    description: "Quiero agendarlo para otro día",
    time: "Elegí fecha y hora",
  },
];

const URGENCY_CONFIG: Record<string, { label: string; class: string }> = {
  EMERGENCY: { label: "Emergencia", class: "urgency-emergency" },
  TODAY: { label: "Hoy", class: "urgency-today" },
  SCHEDULED: { label: "Programado", class: "urgency-scheduled" },
};

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  PENDING: { label: "Esperando ofertas", class: "status-pending" },
  ACTIVE: { label: "Con ofertas", class: "status-active" },
  ACCEPTED: { label: "Oferta aceptada", class: "status-accepted" },
  IN_TRANSIT: { label: "En camino", class: "status-transit" },
  IN_PROGRESS: { label: "En progreso", class: "status-progress" },
  COMPLETED: { label: "Completado", class: "status-completed" },
  CANCELLED: { label: "Cancelado", class: "status-cancelled" },
};

const URGENCY_LABELS: Record<string, string> = {
  EMERGENCY: "🔴 Emergencia",
  TODAY: "🟡 Hoy",
  SCHEDULED: "🔵 Programado",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Esperando ofertas",
  ACTIVE: "Con ofertas",
  ACCEPTED: "Oferta aceptada",
  IN_TRANSIT: "Profesional en camino",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const TABS = [
  { key: undefined, label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "ACCEPTED", label: "Aceptadas" },
  { key: "IN_PROGRESS", label: "En Progreso" },
  { key: "COMPLETED", label: "Completadas" },
  { key: "CANCELLED", label: "Canceladas" },
];

const URGENCY_RULES: Record<string, { label: string; class: string }> = {
  EMERGENCY: { label: "🔴 Emergencia", class: "pro-urgency-emergency" },
  TODAY: { label: "🟡 Hoy", class: "pro-urgency-today" },
  SCHEDULED: { label: "🔵 Programado", class: "pro-urgency-scheduled" },
};

const STEPS = [
  { key: "ACCEPTED", label: "Aceptado", icon: "✓" },
  { key: "IN_TRANSIT", label: "En camino", icon: "🚗" },
  { key: "ARRIVED", label: "Llegó", icon: "📍" },
  { key: "IN_PROGRESS", label: "Trabajando", icon: "🔧" },
  { key: "COMPLETED", label: "Completado", icon: "✅" },
];

function getStepIndex(status: string, arrivedAt: string | null): number {
  if (status === "COMPLETED") return 4;
  if (status === "IN_PROGRESS") return 3;
  if (status === "IN_TRANSIT" && arrivedAt) return 2;
  if (status === "IN_TRANSIT") return 1;
  return 0;
}

export {
  URGENCY_OPTIONS,
  URGENCY_CONFIG,
  STATUS_CONFIG,
  URGENCY_LABELS,
  STATUS_LABELS,
  TABS,
  URGENCY_RULES,
  STEPS,
  getStepIndex,
};
