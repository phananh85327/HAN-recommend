import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ModelsPage from './pages/ModelsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import UserPage from './pages/UserPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import { ServedProvider } from './served.jsx'

export default function App() {
  return (
    <ServedProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:asin" element={<ProductPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ServedProvider>
  )
}
