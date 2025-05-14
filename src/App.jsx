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
import Contacto from "./pages/Contacto";

import { consultarOntologia } from "./utils/sparqlClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config/envs";

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

  // Función para obtener vuelos programados
  const obtenerVuelosProgramados = async () => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX : <http://www.semanticweb.org/aeropuerto#>

      SELECT ?vuelo ?nombreAerolinea ?ciudadOrigen ?ciudadDestino WHERE {
        ?vuelo rdf:type :Vuelo .
        ?vuelo :estadoVuelo "Programado" .
        OPTIONAL {
          ?aerolinea :operaVuelo ?vuelo .
          ?aerolinea :nombreAerolinea ?nombreAerolinea .
        }
        OPTIONAL {
          ?vuelo :tieneOrigen ?origenAero .
          ?origenAero :ciudadAeropuerto ?ciudadOrigen .
        }
        OPTIONAL {
          ?vuelo :tieneDestino ?destinoAero .
          ?destinoAero :ciudadAeropuerto ?ciudadDestino .
        }
      } LIMIT 12
    `;
    const resultados = await consultarOntologia(query);
    return resultados.results.bindings;
  };

  // Función para búsqueda filtrada
  const buscarVuelosFiltrados = async (origen, destino, aerolinea) => {
    const filtroOrigen = origen
      ? `?vuelo :tieneOrigen ?origenAero .
         ?origenAero :ciudadAeropuerto ?ciudadOrigen .
         FILTER(CONTAINS(LCASE(STR(?ciudadOrigen)), LCASE("${origen}")))`
      : `OPTIONAL { ?vuelo :tieneOrigen ?origenAero . ?origenAero :ciudadAeropuerto ?ciudadOrigen . }`;

    const filtroDestino = destino
      ? `?vuelo :tieneDestino ?destinoAero .
         ?destinoAero :ciudadAeropuerto ?ciudadDestino .
         FILTER(CONTAINS(LCASE(STR(?ciudadDestino)), LCASE("${destino}")))`
      : `OPTIONAL { ?vuelo :tieneDestino ?destinoAero . ?destinoAero :ciudadAeropuerto ?ciudadDestino . }`;

    const filtroAerolinea = aerolinea
      ? `?aerolinea :operaVuelo ?vuelo .
         ?aerolinea :nombreAerolinea ?nombreAerolinea .
         FILTER(CONTAINS(LCASE(STR(?nombreAerolinea)), LCASE("${aerolinea}")))`
      : `OPTIONAL { ?aerolinea :operaVuelo ?vuelo . ?aerolinea :nombreAerolinea ?nombreAerolinea . }`;

    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX : <http://www.semanticweb.org/aeropuerto#>

      SELECT ?vuelo ?nombreAerolinea ?ciudadOrigen ?ciudadDestino WHERE {
        ?vuelo rdf:type :Vuelo .
        ?vuelo :estadoVuelo "Programado" .
        ${filtroOrigen}
        ${filtroDestino}
        ${filtroAerolinea}
      } LIMIT 30
    `;
    const resultados = await consultarOntologia(query);
    return resultados.results.bindings;
  };
  // Función para obtenerDetalleVuelo
  const obtenerDetalleVuelo = async (idVuelo) => {
    const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX : <http://www.semanticweb.org/aeropuerto#>

    SELECT ?numero ?origen ?destino ?nombreAerolinea ?puerta ?estado ?horaSalida ?horaLlegada WHERE {
      BIND(<${decodeURIComponent(idVuelo)}> AS ?vuelo)
      OPTIONAL { ?vuelo :numeroVuelo ?numero . }
      OPTIONAL {
        ?vuelo :tieneOrigen ?ori .
        ?ori :ciudadAeropuerto ?origen .
      }
      OPTIONAL {
        ?vuelo :tieneDestino ?dest . 
        ?dest :ciudadAeropuerto ?destino .
      }
      OPTIONAL {
        ?aerolinea :operaVuelo ?vuelo .
        ?aerolinea :nombreAerolinea ?nombreAerolinea .
      }
      OPTIONAL {
        ?vuelo :asignadoAPuerta ?puertaObj .
        ?puertaObj :identificadorPuerta ?puerta .
      }
      OPTIONAL { ?vuelo :estadoVuelo ?estado . }
      OPTIONAL { ?vuelo :horaSalidaVuelo ?horaSalida . }
      OPTIONAL { ?vuelo :horaLlegadaVuelo ?horaLlegada . }
    } LIMIT 1
  `;
    const resultado = await consultarOntologia(query);
    console.log("🔍 Resultado de SPARQL DetalleVuelo:", resultado);
    return resultado.results.bindings[0]; // Esto podría ser undefined
  };
  // Función para registrarReserva
  const registrarReserva = async ({ nombre, tipoDocumento, numeroDocumento, nacionalidad, vueloId }) => {
    const idPasajero = `Pasajero_${Date.now()}`;
    const pasajeroURI = `:${idPasajero}`;
    const vueloURI = `<${decodeURIComponent(vueloId)}>`;

    const query = `
    PREFIX : <http://www.semanticweb.org/aeropuerto#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    INSERT DATA {
      ${pasajeroURI} rdf:type :Pasajero ;
        :idPasajero "${idPasajero}" ;
        :nombrePasajero "${nombre}" ;
        :tipoDocumentoPasajero "${tipoDocumento}" ;
        :numeroDocumentoPasajero "${numeroDocumento}" ;
        :nacionalidadPasajero "${nacionalidad}" ;
        :abordaVuelo ${vueloURI} .
    }
  `;
    const { insertarEnOntologia } = await import("./utils/sparqlInsert");
    await insertarEnOntologia(query);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} isSignedIn={isSignedIn} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="/vuelos" element={
        <Vuelos
          obtenerVuelosProgramados={obtenerVuelosProgramados}
          buscarVuelosFiltrados={buscarVuelosFiltrados}
        />
      } />
      <Route path="/vuelos/:id" element={<DetalleVuelo obtenerDetalleVuelo={obtenerDetalleVuelo} />} />
      <Route path="/reservar/:id" element={<ReservaVuelo registrarReserva={registrarReserva} />} />
      <Route path="/admin" element={<Administrador />} />
      <Route path="/redirect" element={<AuthRedirect />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  );
}

export default App;
