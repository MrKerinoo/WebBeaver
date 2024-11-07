import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"

import Domov from './pages/Domov/Domov'
import Kontakt from './pages/Kontakt/Kontakt'
import Onas from './pages/Onas/Onas'
import Header from './layout/Header'
import Footer from './layout/Footer'

export default function App() {

  return (
    <BrowserRouter>
      <StrictMode>

        <Header/>

        <Routes>
          <Route path="/" element={<Domov />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/onas" element={<Onas />} />
        </Routes>

        <Footer/>

      </StrictMode>,
  </BrowserRouter>
  )
}