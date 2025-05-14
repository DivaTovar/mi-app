import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DetalleVuelo({ obtenerDetalleVuelo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vuelo, setVuelo] = useState(null);

  useEffect(() => {
    if (obtenerDetalleVuelo) {
      obtenerDetalleVuelo(id)
        .then(setVuelo)
        .catch((error) => console.error("❌ Error al obtener detalle del vuelo:", error));
    }
  }, [id, obtenerDetalleVuelo]);

  if (!vuelo) {
    return <div className="p-8 text-center text-gray-500">Cargando datos del vuelo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-xl shadow-md mt-10">
      <img
        src="/banner.png"
        alt="Banner de vuelo"
        className="w-full h-56 object-cover rounded-md mb-6"
      />

      <h2 className="text-3xl font-bold text-blue-700 mb-6">✈️ Detalle del Vuelo</h2>

      <div className="grid md:grid-cols-2 gap-6 text-gray-800 text-[15px]">
        <div className="space-y-3">
          <p>🎫 <strong>Número de vuelo:</strong> {vuelo.numero?.value || "N/A"}</p>
          <p>🛫 <strong>Origen:</strong> {vuelo.origen?.value || "N/A"}</p>
          <p>🛬 <strong>Destino:</strong> {vuelo.destino?.value || "N/A"}</p>
          <p>🏢 <strong>Aerolínea:</strong> {vuelo.nombreAerolinea?.value || "N/A"}</p>
        </div>

        <div className="space-y-3">
          <p>🚪 <strong>Puerta de embarque:</strong> {vuelo.puerta?.value || "N/A"}</p>
          <p>📌 <strong>Estado:</strong>{" "}
            <span className={`font-semibold ${vuelo.estado?.value === 'Cancelado' ? 'text-red-600' : 'text-green-600'}`}>
              {vuelo.estado?.value || "N/A"}
            </span>
          </p>
          <p>📅 <strong>Hora de salida:</strong> {vuelo.horaSalida?.value || "N/A"}</p>
          <p>📅 <strong>Hora de llegada:</strong> {vuelo.horaLlegada?.value || "N/A"}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          onClick={() => navigate(`/reservar/${encodeURIComponent(id)}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Reservar vuelo
        </button>
        <a
          href="/vuelos"
          className="text-blue-600 hover:underline text-sm self-center"
        >
          ← Volver a Vuelos
        </a>
      </div>

      <div className="mt-12 border-t pt-6">
        <h3 className="text-lg font-bold text-blue-600 mb-3">🌐 Vuelos similares sugeridos</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>🛫 Bogotá → Medellín — Aerolínea: Avianca</li>
          <li>🛫 Cali → Cartagena — Aerolínea: Latam</li>
          <li>🛫 Bucaramanga → Santa Marta — Aerolínea: Viva Air</li>
        </ul>
      </div>
    </div>
  );
}

export default DetalleVuelo;
