const SNOW_QUALITY_LABELS = {
  4.5: { label: 'Polvo Perfecto', color: 'var(--color-snow-powder)', emoji: '❄️' },
  3.5: { label: 'Nieve Compacta', color: 'var(--color-snow-packed)', emoji: '⛷️' },
  2.5: { label: 'Nieve Helada', color: 'var(--color-snow-icy)', emoji: '🧊' },
  0:   { label: 'Nieve Blanda', color: 'var(--color-snow-slushy)', emoji: '💧' },
}

export function getSnowQualityInfo(score) {
  const thresholds = [4.5, 3.5, 2.5, 0]
  const threshold = thresholds.find(t => score >= t)
  return SNOW_QUALITY_LABELS[threshold] ?? SNOW_QUALITY_LABELS[0]
}
