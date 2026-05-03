export const FILE_CATEGORIES = {
  images: {
    label: 'Images',
    color: '#f472b6',
    darkBg: 'rgba(244,114,182,0.15)',
    extensions: ['jpg','jpeg','png','gif','webp','svg','bmp','ico','tiff','tif','raw','heic','heif','avif'],
  },
  videos: {
    label: 'Videos',
    color: '#fb923c',
    darkBg: 'rgba(251,146,60,0.15)',
    extensions: ['mp4','mkv','avi','mov','wmv','flv','webm','m4v','mpg','mpeg','3gp','ts','vob'],
  },
  audio: {
    label: 'Audio',
    color: '#a78bfa',
    darkBg: 'rgba(167,139,250,0.15)',
    extensions: ['mp3','wav','flac','aiff','aac','ogg','wma','m4a','opus','alac','ape','dsd','dsf','mka','wv','tta','aif'],
  },
  documents: {
    label: 'Documents',
    color: '#60a5fa',
    darkBg: 'rgba(96,165,250,0.15)',
    extensions: ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','rtf','csv','md','odt','ods','odp','pages','numbers','key'],
  },
  archives: {
    label: 'Archives',
    color: '#fbbf24',
    darkBg: 'rgba(251,191,36,0.15)',
    extensions: ['zip','rar','7z','tar','gz','bz2','xz','zst','cab','iso','tgz'],
  },
  executables: {
    label: 'Executables',
    color: '#34d399',
    darkBg: 'rgba(52,211,153,0.15)',
    extensions: ['exe','msi','bat','cmd','sh','ps1','pkg','deb','rpm','appimage','apk'],
  },
  other: {
    label: 'Other',
    color: '#94a3b8',
    darkBg: 'rgba(148,163,184,0.12)',
    extensions: [],
  },
}

export function getFileCategory(ext) {
  const lower = (ext || '').toLowerCase()
  for (const [key, cat] of Object.entries(FILE_CATEGORIES)) {
    if (key !== 'other' && cat.extensions.includes(lower)) return key
  }
  return 'other'
}

export function getCategoryConfig(category) {
  return FILE_CATEGORIES[category] ?? FILE_CATEGORIES.other
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${units[i]}`
}

export function formatDate(iso) {
  const date = new Date(iso)
  const diffMs = Date.now() - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1)   return 'Just now'
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)   return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
