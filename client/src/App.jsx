import React, { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoadingSpiner from "./components/LoadingSpiner.jsx";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Domov from "./pages/Domov/Domov";
import Kontakt from "./pages/Kontakt/Kontakt";
import Onas from "./pages/Onas/Onas";

import Prihlasenie from "./pages/Prihlasenie/Prihlasenie";
import Profil from "./pages/Profil/Profil";
import Faktury from "./pages/Admin/Faktury/Faktury.jsx";
import Pouzivatel from "./Pouzivatel/Pouzivatel.jsx";
import Pouzivatelia from "./pages/Admin/Pouzivatelia/Pouzivatelia.jsx";
import Formulare from "./pages/Admin/Formulare.jsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpiner />;
  }

  if (!user || !roles.includes(user.role)) {
    // ZOBRAZIT OKNO - UZIVATEL NEMA PRAVA
    return <Navigate to="/" />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <StrictMode>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Domov />} />
                  <Route path="/kontakt" element={<Kontakt />} />
                  <Route path="/onas" element={<Onas />} />
                  <Route path="/prihlasenie" element={<Prihlasenie />} />

                  <Route
                    path="/pouzivatelia"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Pouzivatelia />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/formulare"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Formulare />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/pouzivatel"
                    element={
                      <ProtectedRoute roles={["USER"]}>
                        <Pouzivatel />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/faktury"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Faktury />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profil"
                    element={
                      <ProtectedRoute roles={["ADMIN", "USER"]}>
                        <Profil />
                      </ProtectedRoute>
                    }
                  />
                  {/* DOROBIT NOT FOUND PAGE <Route Component={<NenaslaSa/>} /> */}
                </Routes>
              </main>
              <Footer />
            </div>
          </StrictMode>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
}
