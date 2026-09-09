import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

import  PublicNavbar  from "@/components/navbar/PublicNavbar";
import  AuthNavbar  from "@/components/navbar/AuthNavbar";
import Home from "@/pages/Home";
import SignInPage from "@/pages/Auth/SignInPage";
import SignUpPage from "@/pages/Auth/SignUpPage";
import Accueil from "@/pages/user_pages/Accueil";
import Comptes from "@/pages/user_pages/Comptes";
import Transactions from "@/pages/user_pages/Transactions";
import NouveauCompte from "@/pages/user_pages/NouveauCompte";
import Pret from "@/pages/user_pages/Pret";
import Produits from "@/pages/user_pages/Produits";
import VirementPage from "./pages/user_pages/virements/Virement";
import DetailsComptePage from "./pages/user_pages/DetailsCompte";
import VirementAction from "./pages/user_pages/virements/VirementAction";
import VirementExternePage from "./pages/user_pages/virements/VirementExternePage";
import VirementInternePage from "./pages/user_pages/virements/VirementInternePage";
import AdminPage from "./pages/admin_pages/AdminPage";
import { useEffect } from "react";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  if (user?.publicMetadata?.role === "admin") {
    return children;
  }
  return <Navigate to="/accueil" replace />;
}


export default function App() {
  const location = useLocation();
  const { user } = useUser();
  const isAuthRoute = location.pathname.startsWith("/accueil") ||
                      location.pathname.startsWith("/comptes") ||
                      location.pathname.startsWith("/transactions") ||
                      location.pathname.startsWith("/produits") ||
                      location.pathname.startsWith("/pret");

  return (
    <>
     
      {/* 🔹 Navbar conditionnelle */}
      {isAuthRoute && <AuthNavbar />}

      {/* 🔹 Pages accessibles avant connexion */}
      <SignedOut>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          {/* Redirection si l’utilisateur tente d’accéder à une page protégée */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedOut>

      {/* 🔹 Pages accessibles après connexion */}
      <SignedIn>
        <Routes>
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/admin" element={ <AdminRoute> <AdminPage /> </AdminRoute> }/>
            <Route path="/comptes" element={<Comptes />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/virement/:id" element={<VirementPage />} />
            <Route path="/virement" element={<VirementAction />} />
            <Route path="/virement/interne" element={<VirementInternePage />} />
            <Route path="/virement/externe" element={<VirementExternePage />} />

            <Route path="/compte/:id" element={<DetailsComptePage />} />
            <Route path="/nouveau-compte" element={<NouveauCompte />} />
            <Route path="/pret" element={<Pret />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="*" element={<Navigate to="/accueil" replace />} />
        </Routes>
      </SignedIn>

    </>
  );
}