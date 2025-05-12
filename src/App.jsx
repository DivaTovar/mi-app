import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

// Páginas
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Vuelos from "./pages/Vuelos";
import DetalleVuelo from "./pages/DetalleVuelo";
import ReservaVuelo from "./pages/ReservaVuelo";
import Administrador from "./pages/administrador";
import AuthRedirect from "./pages/AuthRedirect";
import Contacto from "./pages/Contacto"; // ✅ Agregado

const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // recortado por privacidad

function App() {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress) {
      axios
        .put(
          `${SUPABASE_URL}?id=eq.${user.id}`,
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

      if (user?.publicMetadata?.role === "admin") {
        navigate("/admin");
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} isSignedIn={isSignedIn} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/vuelos" element={<Vuelos />} />
      <Route path="/vuelos/:id" element={<DetalleVuelo />} />
      <Route path="/reservar/:id" element={<ReservaVuelo />} />
      <Route path="/admin" element={<Administrador />} />
      <Route path="/redirect" element={<AuthRedirect />} />
      <Route path="/contacto" element={<Contacto />} /> {/* ✅ Ruta para la página de contacto */}
    </Routes>
  );
}

export default App;
