import { useState, useEffect } from "react";

function Vuelos({ obtenerVuelosProgramados, buscarVuelosFiltrados }) {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [aerolinea, setAerolinea] = useState("");
  const [vuelos, setVuelos] = useState([]);

  useEffect(() => {
    if (obtenerVuelosProgramados) {
      obtenerVuelosProgramados()
        .then(setVuelos)
        .catch((err) => console.error("❌ Error al cargar vuelos:", err));
    }
  }, [obtenerVuelosProgramados]);

  const buscarVuelos = () => {
    if (buscarVuelosFiltrados) {
      buscarVuelosFiltrados(origen, destino, aerolinea)
        .then(setVuelos)
        .catch((err) => console.error("❌ Error al buscar vuelos:", err));
    }
  };

  const limpiarFormulario = () => {
    setOrigen("");
    setDestino("");
    setAerolinea("");
    if (obtenerVuelosProgramados) {
      obtenerVuelosProgramados().then(setVuelos);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <header className="border-b shadow-sm bg-blue-50 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-4">
          <a href="/">
            <img src="/Logo_IMG.png" className="h-10 w-auto" alt="Logo" />
          </a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</a>
            <a href="/vuelos" className="text-gray-700 hover:text-blue-600 font-medium">Vuelos</a>
            <a href="/contacto" className="text-gray-700 hover:text-blue-600 font-medium">Contacto</a>
          </nav>
        </div>
      </header>

      {/* FORMULARIO */}
      <section className="bg-blue-800 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-semibold">ORIGEN</label>
                <input type="text" placeholder="Ciudad de origen" value={origen} onChange={(e) => setOrigen(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">DESTINO</label>
                <input type="text" placeholder="Ciudad de destino" value={destino} onChange={(e) => setDestino(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">AEROLÍNEA</label>
                <input type="text" placeholder="Nombre de la aerolínea" value={aerolinea} onChange={(e) => setAerolinea(e.target.value)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button onClick={buscarVuelos} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded shadow-md">Buscar</button>
              <button onClick={limpiarFormulario} className="bg-gray-300 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded shadow">Limpiar</button>
            </div>
          </div>
        </div>
      </section>

      {/* TARJETAS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Vuelos encontrados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vuelos.map((v, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <h3 className="text-sm text-gray-500 font-semibold mb-2">AEROLÍNEA</h3>
              <p className="text-lg font-bold text-blue-600 mb-1">{v.nombreAerolinea?.value || "-"}</p>
              <p className="text-sm text-gray-700">Origen: <span className="font-medium">{v.ciudadOrigen?.value || "-"}</span></p>
              <p className="text-sm text-gray-700 mb-4">Destino: <span className="font-medium">{v.ciudadDestino?.value || "-"}</span></p>
              <a href={`/vuelos/${encodeURIComponent(v.vuelo?.value)}`} className="text-blue-600 hover:underline text-sm mt-2 block">Ver detalles</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Vuelos;
