export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export function monthName(monthNumber) {
  return MONTHS_ES[(monthNumber - 1) % 12] || ''
}

export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 30) return `Hace ${days} días`
  const months = Math.floor(days / 30)
  if (months < 12) return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  return `Hace ${Math.floor(months / 12)} ${Math.floor(months/12) === 1 ? 'año' : 'años'}`
}
