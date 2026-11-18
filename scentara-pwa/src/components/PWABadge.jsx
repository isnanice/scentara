import { useEffect, useState } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

// Banner status offline dan ajakan memasang aplikasi (install prompt PWA).
export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    const onInstalled = () => setInstallPrompt(null)
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  if (offline) {
    return (
      <aside className="pwa-badge" role="status">
        <WifiOff size={16} />
        <span>Sedang offline. Data yang pernah dibuka tetap bisa dilihat.</span>
      </aside>
    )
  }

  if (installPrompt && !dismissed) {
    return (
      <aside className="pwa-badge" role="region" aria-label="Pasang aplikasi">
        <Download size={16} />
        <span>Pasang Scentara di perangkatmu.</span>
        <button type="button" className="btn btn--small" onClick={install}>
          Pasang
        </button>
        <button type="button" className="icon-btn" onClick={() => setDismissed(true)} aria-label="Tutup">
          <X size={14} />
        </button>
      </aside>
    )
  }

  return null
}
