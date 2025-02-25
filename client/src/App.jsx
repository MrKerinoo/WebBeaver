import React, { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoadingSpiner from "./components/LoadingSpiner.jsx";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact.jsx";
import About from "./pages/About/About.jsx";
import Login from "./pages/Login/Login.jsx";
import Users from "./pages/Admin/Users/Users.jsx";
import Form from "./pages/Admin/Form.jsx";
import User from "./pages/User/User.jsx";
import Invoice from "./pages/Admin/Invoice/Invoice.jsx";
import Profile from "./pages/Profile/Profile.jsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpiner />;
  }

  if (!user || !roles.includes(user.role)) {
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
                  <Route path="/" element={<Home />} />
                  <Route path="/kontakt" element={<Contact />} />
                  <Route path="/onas" element={<About />} />
                  <Route path="/prihlasenie" element={<Login />} />

                  <Route
                    path="/pouzivatelia"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Users />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/formulare"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Form />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/pouzivatel"
                    element={
                      <ProtectedRoute roles={["USER"]}>
                        <User />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/faktury"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <Invoice />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profil"
                    element={
                      <ProtectedRoute roles={["ADMIN", "USER"]}>
                        <Profile />
                      </ProtectedRoute>
                    }
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
