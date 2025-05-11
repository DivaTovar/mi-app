import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { insertarEnOntologia } from "../utils/sparqlInsert";

function ReservaVuelo() {
  const { id } = useParams(); // URI del vuelo
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("Cédula de Identidad");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("Colombiano");
  const [mensaje, setMensaje] = useState("");

  const generarIDPasajero = () => `Pasajero_${Date.now()}`;
  const vueloURI = `<${decodeURIComponent(id)}>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idPasajero = generarIDPasajero();
    const pasajeroURI = `:${idPasajero}`;

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

    try {
      await insertarEnOntologia(query);
      setMensaje("✅ Reserva registrada con éxito");
      setTimeout(() => navigate("/vuelos"), 2000);
    } catch (err) {
      setMensaje("❌ Error al registrar la reserva");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">

      {/* Logo que redirige al Home */}
      <div className="flex justify-center mb-6 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/Logo_IMG.png" alt="Logo" className="h-24 w-auto hover:scale-105 transition-transform" />
      </div>

      <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">Reserva tu vuelo</h2>
      <p className="text-center text-gray-600 mb-8">Completa los siguientes datos para continuar con tu reserva.</p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Nombre */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-1">✍️ NOMBRES</label>
          <input
            type="text"
            placeholder="Ej. Juan Pérez"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Nacionalidad */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-1">🌎 NACIONALIDAD</label>
          <select
            value={nacionalidad}
            onChange={(e) => setNacionalidad(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option>Colombiano</option>
            <option>Peruano</option>
            <option>Argentino</option>
            <option>Mexicano</option>
            <option>Otro</option>
          </select>
        </div>

        {/* Tipo de documento y número */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold flex items-center gap-1">🪪 TIPO DE DOCUMENTO</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option>Cédula de Identidad</option>
              <option>Pasaporte</option>
              <option>Tarjeta de Identidad</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold flex items-center gap-1">🔢 NÚMERO</label>
            <input
              type="text"
              placeholder="Ej. 1234567890"
              required
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Finalizar Reserva
        </button>

        {mensaje && <p className="text-center text-sm mt-4">{mensaje}</p>}
      </form>
    </div>
  );
}

export default ReservaVuelo;
