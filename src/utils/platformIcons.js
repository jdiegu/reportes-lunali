const PLATFORM_MAP = {
  netflix:      { iconId: 'mdi:netflix',                    color: '#E50914' },
  disney:       { iconId: 'selfhst:disney-plus',            color: '#0063E5' },
  'hbo max':    { iconId: 'selfhst:hbo-max-light',          color: '#B438E4' },
  prime:        { iconId: 'selfhst:amazon-prime-video',     color: '#00A8E1' },
  spotify:      { iconId: 'mdi:spotify',                    color: '#1DB954' },
  crunchyroll:  { iconId: 'selfhst:crunchyroll',            color: '#F47521' },
  paramount:    { iconId: 'selfhst:paramount-plus',         color: '#0064FF' },
  apple:        { iconId: 'selfhst:apple-tv-light',         color: '#000000' },
  'yt music':   { iconId: 'simple-icons:youtubemusic',      color: '#FF0000' },
  'yt premium': { iconId: 'mdi:youtube',                    color: '#FF0000' },
  amazon:       { iconId: 'selfhst:amazon',                 color: '#FF9900' },
  chatgpt:      { iconId: 'selfhst:chatgpt',                color: '#F8F8F8' },
  twitch:       { iconId: 'mdi:twitch',                     color: '#9146FF' },
  fox:          { iconId: 'simple-icons:fox',               color: '#FDB927' },
  vix:          { iconId: 'arcticons:vix',                  color: '#FFFFFF' },
  hulu:         { iconId: 'mdi:hulu',                       color: '#1CE783' },
  other:        { iconId: 'mdi:application',                color: '#888888' },
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/[+\-]/g, '').replace(/\s+/g, ' ')
}

export function getPlatformIconId(name) {
  if (!name) return 'mdi:application'
  const key = normalize(name)
  if (PLATFORM_MAP[key]) return PLATFORM_MAP[key].iconId
  for (const [k, v] of Object.entries(PLATFORM_MAP)) {
    if (key.includes(normalize(k)) || normalize(k).includes(key)) return v.iconId
  }
  return 'mdi:application'
}

export function getPlatformColor(name) {
  if (!name) return '#888888'
  const key = normalize(name)
  if (PLATFORM_MAP[key]) return PLATFORM_MAP[key].color
  for (const [k, v] of Object.entries(PLATFORM_MAP)) {
    if (key.includes(normalize(k)) || normalize(k).includes(key)) return v.color
  }
  return '#888888'
}

export function getAllPlatforms() {
  return Object.entries(PLATFORM_MAP)
    .filter(([k]) => k !== 'other')
    .map(([key, val]) => ({ key, ...val }))
}

export async function searchIcons(query) {
  if (!query || query.length < 2) return []
  try {
    const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=24`)
    const data = await res.json()
    return (data.icons || []).slice(0, 24)
  } catch {
    return []
  }
}

export default PLATFORM_MAP
