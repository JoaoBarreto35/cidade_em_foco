import { Route, Routes } from 'react-router-dom';

import { ProtectedAdminRoute } from './components/auth/ProtectedAdminRoute';
import { AppShell } from './components/layout/AppShell';
import { About } from './pages/About';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminModeration } from './pages/AdminModeration';
import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage';
import { NewOccurrence } from './pages/NewOccurrence';
import { OccurrenceDetails } from './pages/OccurrenceDetails';
import { OccurrencesList } from './pages/OccurrencesList';
import { ReportOccurrence } from './pages/ReportOccurrence';
import { ReportResolution } from './pages/ReportResolution';
import { ResolveOccurrence } from './pages/ResolveOccurrence';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/occurrences" element={<OccurrencesList />} />
        <Route path="/occurrences/new" element={<NewOccurrence />} />
        <Route path="/occurrences/:id" element={<OccurrenceDetails />} />
        <Route path="/occurrences/:id/resolve" element={<ResolveOccurrence />} />
        <Route path="/occurrences/:id/report" element={<ReportOccurrence />} />
        <Route path="/occurrences/:id/resolutions/:resolutionId/report" element={<ReportResolution />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <ProtectedAdminRoute>
            <AdminModeration />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}
