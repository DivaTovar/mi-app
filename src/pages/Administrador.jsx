import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  consultarVuelos,
  consultarAerolineas,
  insertarVueloQuery,
  actualizarVueloQuery,
  eliminarRecursoQuery,
  insertarAerolineaQuery
} from "../utils/services";
import { consultarOntologia } from "../utils/sparqlClient";
import { insertarEnOntologia } from "../utils/sparqlInsert";

function Administrador() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [esAdmin, setEsAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [vista, setVista] = useState("vuelos");
  const [aerolineas, setAerolineas] = useState([]);
  const [nuevaAerolinea, setNuevaAerolinea] = useState({ nombre: "", codigoAOC: "", tipoAeronave: "" });
  const [nuevoVuelo, setNuevoVuelo] = useState({ numeroVuelo: "", origen: "", destino: "", fecha: "", aerolinea: "" });
  const [vuelos, setVuelos] = useState([]);
  const [vueloEditando, setVueloEditando] = useState(null);
  const vuelosPorPagina = 10;

  const [filtro, setFiltro] = useState({
    origen: "",
    destino: "",
    fecha: "",
    estado: ""
  });

  const BotonAzul = ({ onClick, children }) => (
    <button onClick={onClick} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
      {children}
    </button>
  );

  const vuelosFiltrados = vuelos.filter((v) =>
    (!filtro.origen || v.origen?.value?.toLowerCase().includes(filtro.origen.toLowerCase())) &&
    (!filtro.destino || v.destino?.value?.toLowerCase().includes(filtro.destino.toLowerCase())) &&
    (!filtro.estado || v.estado?.value === filtro.estado)
  ).slice(0, vuelosPorPagina);

  const actualizarVuelo = async (vuelo) => {
    const uri = vuelo.vuelo.value;
    const nuevoEstado = vuelo.estado?.value || "";
    if (!nuevoEstado) return alert("⚠️ El estado no puede estar vacío.");
    const updateQuery = actualizarVueloQuery(uri, nuevoEstado);
    try {
      await insertarEnOntologia(updateQuery);
      alert("✅ Estado del vuelo actualizado correctamente.");
      setVueloEditando(null);
      cargarVuelos();
    } catch (error) {
      console.error("❌ Error actualizando el estado del vuelo:", error);
      alert("Ocurrió un error al actualizar el vuelo.");
    }
  };

  const handleEliminarVuelo = async (uri) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este vuelo?");
    if (!confirmar) return;
    const deleteQuery = eliminarRecursoQuery(uri);
    try {
      await insertarEnOntologia(deleteQuery);
      alert("Vuelo eliminado correctamente.");
      cargarVuelos();
    } catch (err) {
      console.error("Error al eliminar vuelo", err);
      alert("❌ Ocurrió un error al eliminar el vuelo.");
    }
  };

  const handleInputChange = (e) => {
    setNuevoVuelo({ ...nuevoVuelo, [e.target.name]: e.target.value });
  };

  const handleAgregarVuelo = async () => {
    const timestamp = Date.now();
    const id = `Vuelo_${timestamp}`;
    const fechaISO = new Date(nuevoVuelo.fecha).toISOString();
    const insertQuery = insertarVueloQuery({
      id,
      numeroVuelo: nuevoVuelo.numeroVuelo,
      origen: nuevoVuelo.origen,
      destino: nuevoVuelo.destino,
      fechaISO
    });

    const relacionQuery = `
      PREFIX : <http://www.semanticweb.org/ontologia#>
      INSERT DATA {
        :${nuevoVuelo.aerolinea} :operaVuelo :${id} .
      }
    `;

    try {
      await insertarEnOntologia(insertQuery);
      if (nuevoVuelo.aerolinea) {
        await insertarEnOntologia(relacionQuery);
      }
      alert("✅ Vuelo agregado correctamente.");
      setNuevoVuelo({ numeroVuelo: "", origen: "", destino: "", fecha: "", aerolinea: "" });
      cargarVuelos();
    } catch (err) {
      console.error("❌ Error al insertar vuelo:", err);
      alert("Error al agregar vuelo.");
    }
  };

  const cargarVuelos = async () => {
    try {
      const resultado = await consultarOntologia(consultarVuelos());
      setVuelos(resultado.results.bindings);
    } catch (error) {
      console.error("❌ Error al cargar vuelos:", error);
    }
  };

  const cargarAerolineas = async () => {
    try {
      const resultado = await consultarOntologia(consultarAerolineas());
      setAerolineas(resultado.results.bindings);
    } catch (error) {
      console.error("❌ Error al consultar aerolíneas", error);
    }
  };

  const extraerNombre = (uri) => {
    return uri.split("#")[1];
  };

  const registrarAerolinea = async () => {
    const timestamp = Date.now();
    const id = `Aerolinea_${timestamp}`;
    const nombre = `${nuevaAerolinea.nombre} ${timestamp % 1000}_${timestamp % 1000}`;
    const fechaISO = new Date().toISOString();
    const insertQuery = insertarAerolineaQuery({
      id,
      nombre,
      codigoAOC: nuevaAerolinea.codigoAOC,
      tipoAeronave: nuevaAerolinea.tipoAeronave,
      fechaISO
    });
    try {
      await insertarEnOntologia(insertQuery);
      setNuevaAerolinea({ nombre: "", codigoAOC: "", tipoAeronave: "" });
      setTimeout(() => cargarAerolineas(), 300);
    } catch (error) {
      console.error("❌ Error al registrar aerolínea:", error);
    }
  };

  const eliminarAerolinea = async (uri) => {
    const deleteQuery = eliminarRecursoQuery(uri);
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
        obtenerUsuarios().then(setUsuarios).catch(console.error);
        cargarAerolineas();
        cargarVuelos();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isSignedIn) return <div className="p-6 text-center">🔒 Debes iniciar sesión para acceder.</div>;
  if (!esAdmin) return <div className="p-6 text-center text-red-500 font-semibold">🚫 No tienes permisos de administrador.</div>;

  const renderVista = () => {
    switch (vista) {
      case "vuelos":
        return (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🛫 Gestión de Vuelos</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">➕ Agregar nuevo vuelo</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input name="numeroVuelo" value={nuevoVuelo.numeroVuelo} onChange={handleInputChange} placeholder="Número de vuelo" className="border p-2 rounded" />
                <input name="origen" value={nuevoVuelo.origen} onChange={handleInputChange} placeholder="Origen" className="border p-2 rounded" />
                <input name="destino" value={nuevoVuelo.destino} onChange={handleInputChange} placeholder="Destino" className="border p-2 rounded" />
                <input name="fecha" type="date" value={nuevoVuelo.fecha} onChange={handleInputChange} className="border p-2 rounded" />
                <select
                  name="aerolinea"
                  value={nuevoVuelo.aerolinea}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                >
                  <option value="">Seleccione Aerolínea</option>
                  {aerolineas.map((aero, index) => (
                    <option key={index} value={extraerNombre(aero?.aerolinea?.value || '')}>
                      {aero?.nombre?.value || "Sin nombre"}
                    </option>

                  ))}
                </select>

              </div>
              <button onClick={handleAgregarVuelo} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
                Agregar vuelo
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">🔎 Buscar vuelos por origen, destino y estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <input placeholder="Origen" value={filtro.origen} onChange={(e) => setFiltro({ ...filtro, origen: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Destino" value={filtro.destino} onChange={(e) => setFiltro({ ...filtro, destino: e.target.value })} className="border p-2 rounded" />
              <select value={filtro.estado} onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })} className="border p-2 rounded">
                <option value="">Todos</option>
                <option value="Programado">Programado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="En espera">En espera</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vuelosFiltrados.map((vuelo, idx) => (
                <div key={idx} className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold text-blue-700 mb-2">✈️ Vuelo {vuelo.numero?.value}</h3>
                  <p className="mb-1"><strong>Origen:</strong> {vuelo.origen?.value || "-"}</p>
                  <p className="mb-1"><strong>Destino:</strong> {vuelo.destino?.value || "-"}</p>
                  <p className="mb-1"><strong>Fecha:</strong> {vuelo.fecha?.value?.split("T")[0] || "-"}</p>
                  <p className="mb-1"><strong>Estado:</strong> <span className="px-2 py-1 bg-gray-200 rounded">{vuelo.estado?.value || "Desconocido"}</span></p>
                  <p className="mb-3"><strong>Aerolínea:</strong> {vuelo.aerolinea?.value || "Sin asignar"}</p>
                  <div className="flex gap-2">
                    <BotonAzul onClick={() => setVueloEditando(vuelo)}>✏️ Editar</BotonAzul>
                    <BotonAzul onClick={() => handleEliminarVuelo(vuelo.vuelo.value)}>❌ Eliminar</BotonAzul>
                  </div>
                  {vueloEditando?.vuelo?.value === vuelo.vuelo.value && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h4 className="font-semibold mb-2">✏️ Editar vuelo</h4>
                      <input
                        className="border p-2 mb-2 w-full rounded"
                        value={vueloEditando.estado?.value || ""}
                        onChange={(e) =>
                          setVueloEditando({
                            ...vueloEditando,
                            estado: { value: e.target.value },
                          })
                        }
                        placeholder="Nuevo estado"
                      />
                      <button
                        onClick={() => actualizarVuelo(vueloEditando)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
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
