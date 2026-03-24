import './styles/variables.css'
import './styles/global.css'
import { MountainProvider, useMountainContext } from './context/MountainContext.jsx'
import { ReviewProvider } from './context/ReviewContext.jsx'
import { useHashRouter } from './hooks/useHashRouter.js'
import { AppShell } from './components/layout/AppShell.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { MountainDetailPage } from './pages/MountainDetailPage.jsx'
import { MapPage } from './pages/MapPage.jsx'

function AppContent() {
  const { route, params } = useHashRouter()
  const { updateMountainRating } = useMountainContext()

  return (
    <ReviewProvider onRatingUpdate={updateMountainRating}>
      <AppShell>
        {route === 'home' && <HomePage />}
        {route === 'mountain' && <MountainDetailPage mountainId={params.id} />}
        {route === 'mapa' && <MapPage />}
      </AppShell>
    </ReviewProvider>
  )
}

export default function App() {
  return (
    <MountainProvider>
      <AppContent />
    </MountainProvider>
  )
}
