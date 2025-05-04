import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Vuelos from "./pages/Vuelos";

const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnJxcHFvdnRvbWNrZGV2anBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzU5MDEsImV4cCI6MjA2MTk1MTkwMX0.SE8h778-KCbUGZw3fkyV7a8wYcsWTx-sMyBamajg4Cs";

function App() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      axios
        .post(
          SUPABASE_URL,
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
              Prefer: "return=minimal",
            },
          }
        )
        .then(() => console.log("✅ Usuario registrado en Supabase"))
        .catch((err) =>
          console.error("❌ Error al registrar usuario en Supabase:", err)
        );
    }
  }, [isSignedIn, user]);

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} isSignedIn={isSignedIn} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/vuelos" element={<Vuelos />} />
    </Routes>
  );
}

export default App;
