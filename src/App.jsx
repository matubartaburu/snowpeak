import './styles/variables.css'
import './styles/global.css'
import { MountainProvider, useMountainContext } from './context/MountainContext.jsx'
import { ReviewProvider } from './context/ReviewContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { useHashRouter } from './hooks/useHashRouter.js'
import { AppShell } from './components/layout/AppShell.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { MountainDetailPage } from './pages/MountainDetailPage.jsx'
import { MapPage } from './pages/MapPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'

function AppContent() {
  const { route, params } = useHashRouter()
  const { updateMountainRating } = useMountainContext()

  return (
    <ReviewProvider onRatingUpdate={updateMountainRating}>
      <AppShell>
        {route === 'home' && <HomePage />}
        {route === 'mountain' && <MountainDetailPage mountainId={params.id} />}
        {route === 'mapa' && <MapPage />}
        {route === 'perfil' && <ProfilePage />}
      </AppShell>
    </ReviewProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MountainProvider>
        <AppContent />
      </MountainProvider>
    </AuthProvider>
  )
}
