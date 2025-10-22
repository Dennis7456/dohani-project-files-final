import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/graphql.js'
import './index.css'
import App from '@/App.jsx'
import Layout from '@/components/Layout.jsx'
import ScrollToTop from '@/components/ScrollToTop.jsx'
import AboutPage from '@/pages/AboutPage.jsx'
import ServicePage from '@/pages/ServicePage.jsx'
import DoctorPage from '@/pages/DoctorPage.jsx'
import NewsPage from '@/pages/NewsPage.jsx'
import CMSAdmin from '@/components/CMSAdmin'
import AppointmentAdmin from '@/components/AppointmentAdmin'
import CMSAdminDashboard from '@/components/CMSAdminDashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<Layout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/service/:id" element={<ServicePage />} />
            <Route path="/doctor/:id" element={<DoctorPage />} />
            <Route path="/news/:id" element={<NewsPage />} />
          </Route>
          <Route path="/admin" element={<CMSAdmin />} />
          <Route path="/admin/appointments" element={<AppointmentAdmin />} />
          <Route path="/admin/cms" element={<CMSAdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
