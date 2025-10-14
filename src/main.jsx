import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/graphql'
import './index.css'
import App from '@/App.jsx'
import CMSAdmin from '@/components/CMSAdmin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<CMSAdmin />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
