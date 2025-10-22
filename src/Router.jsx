import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import AboutPage from './pages/AboutPage'
import ServicePage from './pages/ServicePage'
import DoctorPage from './pages/DoctorPage'
import NewsPage from './pages/NewsPage'
import Layout from './components/Layout'

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/" element={<Layout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/doctor/:id" element={<DoctorPage />} />
          <Route path="/news/:id" element={<NewsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter