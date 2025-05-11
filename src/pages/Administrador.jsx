import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { consultarOntologia } from "../utils/sparqlClient";
import { insertarEnOntologia } from "../utils/sparqlInsert";

const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios?select=id,nombre,correo";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnJxcHFvdnRvbWNrZGV2anBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzU5MDEsImV4cCI6MjA2MTk1MTkwMX0.SE8h778-KCbUGZw3fkyV7a8wYcsWTx-sMyBamajg4Cs";

function Administrador() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [esAdmin, setEsAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [vista, setVista] = useState("vuelos");
  const [aerolineas, setAerolineas] = useState([]);
  const [nuevaAerolinea, setNuevaAerolinea] = useState({ nombre: "", codigoAOC: "", tipoAeronave: "" });
  const [nuevoVuelo, setNuevoVuelo] = useState({ numeroVuelo: "", origen: "", destino: "", fecha: "" });

  const handleInputChange = (e) => {
    setNuevoVuelo({ ...nuevoVuelo, [e.target.name]: e.target.value });
  };

  const handleAgregarVuelo = () => {
    alert(`Vuelo agregado:\n${JSON.stringify(nuevoVuelo, null, 2)}`);
    setNuevoVuelo({ numeroVuelo: "", origen: "", destino: "", fecha: "" });
  };

  const cargarAerolineas = async () => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX : <http://www.semanticweb.org/aeropuerto#>
      SELECT ?aero ?nombre ?codigo ?tipo ?fecha WHERE {
        ?aero rdf:type :Aerolinea .
        OPTIONAL { ?aero :nombreAerolinea ?nombre . }
        OPTIONAL { ?aero :codigoAOC ?codigo . }
        OPTIONAL { ?aero :tipoAeronaveOperada ?tipo . }
        OPTIONAL { ?aero :fechaRegistro ?fecha . }
      } ORDER BY DESC(?fecha)
    `;
    try {
      const resultado = await consultarOntologia(query);
      setAerolineas(resultado.results.bindings);
    } catch (error) {
      console.error("❌ Error al consultar aerolíneas", error);
    }
  };

  const registrarAerolinea = async () => {
    const timestamp = Date.now();
    const id = `Aerolinea_${timestamp}`;
    const nombre = `${nuevaAerolinea.nombre} ${timestamp % 1000}_${timestamp % 1000}`;
    const fechaISO = new Date().toISOString();
  
    const insertQuery = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX : <http://www.semanticweb.org/aeropuerto#>
      INSERT DATA {
        :${id} rdf:type :Aerolinea ;
          :idAerolinea "id${id}" ;
          :nombreAerolinea "${nombre}" ;
          :codigoAOC "${nuevaAerolinea.codigoAOC}" ;
          :tipoAeronaveOperada "${nuevaAerolinea.tipoAeronave}" ;
          :fechaRegistro "${fechaISO}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
      }
    `;
    
    try {
      await insertarEnOntologia(insertQuery);
      setNuevaAerolinea({ nombre: "", codigoAOC: "", tipoAeronave: "" });
      setTimeout(() => cargarAerolineas(), 300);
    } catch (error) {
      console.error("❌ Error al registrar aerolínea:", error.message);
    }
  };
  ;

  const eliminarAerolinea = async (uri) => {
    const deleteQuery = `
      PREFIX : <http://www.semanticweb.org/aeropuerto#>
      DELETE WHERE {
        <${uri}> ?p ?o .
      }
    `;
    try {
      await insertarEnOntologia(deleteQuery);
      await cargarAerolineas();
    } catch (err) {
      console.error("❌ Error al eliminar aerolínea", err);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const rol = user.publicMetadata?.role;
      if (rol === "admin") {
        setEsAdmin(true);
        axios.get(SUPABASE_URL, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }).then((res) => setUsuarios(res.data))
          .catch((err) => console.error("❌ Error al obtener usuarios", err));
        cargarAerolineas();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isSignedIn) return <div className="p-6 text-center">🔒 Debes iniciar sesión para acceder.</div>;
  if (!esAdmin) return <div className="p-6 text-center text-red-500 font-semibold">🚫 No tienes permisos de administrador.</div>;

  const renderVista = () => {
    switch (vista) {
      case "vuelos":
        return (
          <div className="bg-white rounded shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">✈️ Gestión de Vuelos</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input name="numeroVuelo" value={nuevoVuelo.numeroVuelo} onChange={handleInputChange} placeholder="Número de vuelo" className="border p-2 rounded" />
              <input name="origen" value={nuevoVuelo.origen} onChange={handleInputChange} placeholder="Origen" className="border p-2 rounded" />
              <input name="destino" value={nuevoVuelo.destino} onChange={handleInputChange} placeholder="Destino" className="border p-2 rounded" />
              <input name="fecha" type="date" value={nuevoVuelo.fecha} onChange={handleInputChange} className="border p-2 rounded" />
            </div>
            <button onClick={handleAgregarVuelo} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">➕ Agregar vuelo</button>
          </div>
        );
      case "usuarios":
        return (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👥 Usuarios Registrados</h2>
            {usuarios.length === 0 ? (
              <p className="text-gray-500">No hay usuarios registrados aún.</p>
            ) : (
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{u.id}</td>
                      <td className="p-2 border">{u.nombre}</td>
                      <td className="p-2 border">{u.correo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "aerolineas":
        return (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🛩️ Gestión de Aerolíneas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={nuevaAerolinea.nombre} onChange={(e) => setNuevaAerolinea({ ...nuevaAerolinea, nombre: e.target.value })} placeholder="Nombre Aerolínea" className="border p-2 rounded" />
              <input value={nuevaAerolinea.codigoAOC} onChange={(e) => setNuevaAerolinea({ ...nuevaAerolinea, codigoAOC: e.target.value })} placeholder="Código AOC" className="border p-2 rounded" />
              <input value={nuevaAerolinea.tipoAeronave} onChange={(e) => setNuevaAerolinea({ ...nuevaAerolinea, tipoAeronave: e.target.value })} placeholder="Tipo de Aeronave" className="border p-2 rounded" />
            </div>
            <button onClick={registrarAerolinea} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">Registrar Aerolínea</button>

            <h3 className="text-lg font-semibold mt-6 mb-2">✈️ Aerolíneas Registradas</h3>
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Código AOC</th>
                  <th className="p-2 border">Tipo Aeronave</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aerolineas.map((a, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{a.nombre?.value || "-"}</td>
                    <td className="p-2 border">{a.codigo?.value || "-"}</td>
                    <td className="p-2 border">{a.tipo?.value || "-"}</td>
                    <td className="p-2 border">
                      <button onClick={() => eliminarAerolinea(a.aero.value)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Panel de Administrador</h1>
        <SignOutButton>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow">🔒 Cerrar sesión</button>
        </SignOutButton>
      </div>

      <p className="text-gray-600 mb-6">
        👤 Sesión iniciada como: <strong>{user.fullName} (Administrador)</strong>
      </p>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setVista("vuelos")} className={`px-4 py-2 rounded ${vista === "vuelos" ? "bg-blue-600 text-white" : "bg-white border"}`}>Gestión de Vuelos</button>
        <button onClick={() => setVista("usuarios")} className={`px-4 py-2 rounded ${vista === "usuarios" ? "bg-blue-600 text-white" : "bg-white border"}`}>Gestión de Usuarios</button>
        <button onClick={() => setVista("aerolineas")} className={`px-4 py-2 rounded ${vista === "aerolineas" ? "bg-blue-600 text-white" : "bg-white border"}`}>Gestión de Aerolíneas</button>
      </div>

      {renderVista()}
    </div>
  );
}

export default Administrador;
