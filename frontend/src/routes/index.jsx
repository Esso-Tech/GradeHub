import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import Loader from '@/components/ui/Loader'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import Home from '@/pages/public/Home'
import Login from '@/pages/public/Login'
import Register from '@/pages/public/Register'
import Tarifs from '@/pages/public/Tarifs'

import Dashboard from '@/pages/famille/Dashboard'
import NouvelleDemande from '@/pages/famille/NouvelleDemande'
import DetailDemande from '@/pages/famille/DetailDemande'
import Paiement from '@/pages/famille/Paiement'

// Les pages admin ne sont chargées que pour l'administrateur
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const ListeDemandes = lazy(() => import('@/pages/admin/ListeDemandes'))
const DetailDemandeAdmin = lazy(() => import('@/pages/admin/DetailDemandeAdmin'))
const Etablissements = lazy(() => import('@/pages/admin/Etablissements'))
const Statistiques = lazy(() => import('@/pages/admin/Statistiques'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute role="FAMILLE" />}>
              <Route path="/famille" element={<Dashboard />} />
              <Route path="/famille/nouvelle" element={<NouvelleDemande />} />
              <Route path="/famille/demandes/:id" element={<DetailDemande />} />
              <Route path="/famille/demandes/:id/paiement" element={<Paiement />} />
            </Route>

            <Route element={<RoleRoute role="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/demandes" element={<ListeDemandes />} />
              <Route path="/admin/demandes/:id" element={<DetailDemandeAdmin />} />
              <Route path="/admin/etablissements" element={<Etablissements />} />
              <Route path="/admin/statistiques" element={<Statistiques />} />
            </Route>
          </Route>

          <Route path="*" element={<p>Page introuvable.</p>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
