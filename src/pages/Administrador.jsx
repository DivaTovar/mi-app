import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // tu clave real

function Administrador() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [esAdmin, setEsAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const [nuevoVuelo, setNuevoVuelo] = useState({
    numeroVuelo: "",
    origen: "",
    destino: "",
    fecha: "",
  });

  const handleInputChange = (e) => {
    setNuevoVuelo({ ...nuevoVuelo, [e.target.name]: e.target.value });
  };

  const handleAgregarVuelo = () => {
    console.log("✈️ Agregando vuelo:", nuevoVuelo);
    alert(`Vuelo agregado:\n${JSON.stringify(nuevoVuelo, null, 2)}`);
    setNuevoVuelo({ numeroVuelo: "", origen: "", destino: "", fecha: "" });
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      user.reload().then(() => {
        const rol = user.publicMetadata?.role;
        console.log("🔄 Metadata actualizada:", rol);
        if (rol === "admin") {
          setEsAdmin(true);
          axios
            .get(SUPABASE_URL, {
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              },
            })
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error("❌ Error al obtener usuarios", err));
        }
      });
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isSignedIn) {
    return <div className="p-6 text-center">🔒 Debes iniciar sesión para acceder.</div>;
  }

  if (!esAdmin) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        🚫 No tienes permisos de administrador.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Panel de Administrador</h1>
        <SignOutButton>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow">
            🔒 Cerrar sesión
          </button>
        </SignOutButton>
      </div>

      <p className="text-gray-600 mb-6">
        👤 Sesión iniciada como: <strong>{user.fullName} (Administrador)</strong>
      </p>

      {/* Gestión de vuelos */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">✈️ Gestión de Vuelos</h2>
        <p className="mb-4">Agrega un nuevo vuelo a la base de datos:</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="numeroVuelo" value={nuevoVuelo.numeroVuelo} onChange={handleInputChange} placeholder="Número de vuelo" className="border p-2 rounded" />
          <input name="origen" value={nuevoVuelo.origen} onChange={handleInputChange} placeholder="Origen" className="border p-2 rounded" />
          <input name="destino" value={nuevoVuelo.destino} onChange={handleInputChange} placeholder="Destino" className="border p-2 rounded" />
          <input name="fecha" type="date" value={nuevoVuelo.fecha} onChange={handleInputChange} className="border p-2 rounded" />
        </div>

        <button onClick={handleAgregarVuelo} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
          ➕ Agregar vuelo
        </button>
      </div>

      {/* Lista de usuarios */}
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
    </div>
  );
}

export default Administrador;
