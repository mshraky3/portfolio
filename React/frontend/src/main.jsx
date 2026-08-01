import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './index.css'
import App from './App.jsx'
import Tracker from './components/Tracker/Tracker.jsx'
import HqLayout from './pages/hq/HqLayout.jsx'
import TechCompanies from './pages/hq/TechCompanies.jsx'
import RankedTargets from './pages/hq/RankedTargets.jsx'
import Shortlist50km from './pages/hq/Shortlist50km.jsx'
import EmployersItJobs from './pages/hq/EmployersItJobs.jsx'
import VisitRoute from './pages/hq/VisitRoute.jsx'

// The tracker used to live behind the hash `#/hq`. Keep old bookmarks working
// by rewriting them to the real path before the router mounts.
if (window.location.hash.startsWith('#/hq')) {
  const path = window.location.hash.slice(1)
  window.history.replaceState(null, '', path)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Analytics run on the public portfolio only, not the private pages. */}
        <Route
          path="/"
          element={
            <>
              <App />
              <SpeedInsights />
              <Analytics />
            </>
          }
        />

        {/* Private job-hunt area. The tracker keeps its own passphrase gate and
            layout, so HqLayout is a pathless layout route wrapping only the
            research pages rather than a parent of /hq itself. */}
        <Route path="/hq" element={<Tracker />} />
        <Route element={<HqLayout />}>
          <Route path="/hq/companies" element={<TechCompanies />} />
          <Route path="/hq/targets" element={<RankedTargets />} />
          <Route path="/hq/shortlist" element={<Shortlist50km />} />
          <Route path="/hq/it-jobs" element={<EmployersItJobs />} />
          <Route path="/hq/route" element={<VisitRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
