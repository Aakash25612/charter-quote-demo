import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Quotes from './pages/Quotes'
import NewQuote from './pages/NewQuote'
import QuoteDetail from './pages/QuoteDetail'
import Fleet from './pages/Fleet'
import Airports from './pages/Airports'
import Crew from './pages/Crew'
import Settings from './pages/Settings'
import ClientQuote from './pages/ClientQuote'

function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/q/:token" element={<ClientQuote />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/quotes" element={<PrivateRoute><Quotes /></PrivateRoute>} />
            <Route path="/quotes/new" element={<PrivateRoute><NewQuote /></PrivateRoute>} />
            <Route path="/quotes/:id" element={<PrivateRoute><QuoteDetail /></PrivateRoute>} />
            <Route path="/fleet" element={<PrivateRoute><Fleet /></PrivateRoute>} />
            <Route path="/airports" element={<PrivateRoute><Airports /></PrivateRoute>} />
            <Route path="/crew" element={<PrivateRoute><Crew /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute adminOnly><Settings /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
