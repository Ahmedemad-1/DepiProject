import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'

// Starter example: shows how React Router maps a URL to a page component.
// Add the remaining routes (see docs/planning) as the pages get built.
export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">Restaurant</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/menu">Menu</Link>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
    </>
  )
}
