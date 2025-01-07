import React, { StrictMode, useContext, useEffect, useState } from "react";
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

import Pouzivatelia from "./pages/Pouzivatelia/Pouzivatelia";
import PouzivatelInfo from "./pages/Pouzivatelia/PouzivatelInfo";
import PouzivatelUpravit from "./pages/Pouzivatelia/PouzivatelUpravit";
import Prihlasenie from "./pages/Prihlasenie/Prihlasenie";
import Profil from "./pages/Profil/Profil";

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
              <main className="flex flex-1 items-center justify-center">
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
                    path="/profil"
                    element={
                      <ProtectedRoute roles={["ADMIN", "USER"]}>
                        <Profil />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/pouzivatel/:id" element={<PouzivatelInfo />} />
                  <Route
                    path="/pouzivatel/:id/upravit"
                    element={<PouzivatelUpravit />}
                  />
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
