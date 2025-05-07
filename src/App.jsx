import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Vuelos from "./pages/Vuelos";
import Administrador from "./pages/Administrador"; 
import AuthRedirect from "./pages/AuthRedirect"; // ✅ Redirección post login

const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnJxcHFvdnRvbWNrZGV2anBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzU5MDEsImV4cCI6MjA2MTk1MTkwMX0.SE8h778-KCbUGZw3fkyV7a8wYcsWTx-sMyBamajg4Cs";

function App() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      axios
        .put(
          `${SUPABASE_URL}?id=eq.${user.id}`, // filtro por ID
          {
            id: user.id,
            nombre: user.fullName,
            correo: user.primaryEmailAddress.emailAddress,
          },
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
          }
        )
        .then(() => console.log("✅ Usuario registrado o actualizado en Supabase"))
        .catch((err) =>
          console.error("❌ Error al registrar o actualizar en Supabase:", err)
        );

    }
  }, [isSignedIn, user]);

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} isSignedIn={isSignedIn} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/vuelos" element={<Vuelos />} />
      <Route path="/admin" element={<Administrador />} />
      <Route path="/redirect" element={<AuthRedirect />} /> {/* 🔁 Redirección para usuarios */}
    </Routes>
  );
}

export default App;
