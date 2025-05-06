import { useState, useEffect } from "react";
import { consultarOntologia } from "../utils/sparqlClient";

function Vuelos() {
  const [tipoViaje, setTipoViaje] = useState("idaVuelta");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaIda, setFechaIda] = useState("");
  const [fechaVuelta, setFechaVuelta] = useState("");
  const [pasajeros, setPasajeros] = useState(1);
  const [vuelos, setVuelos] = useState([]);

  useEffect(() => {
    const obtenerVuelos = async () => {
      try {
        const resultados = await consultarOntologia(`
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX : <http://www.semanticweb.org/aeropuerto#>
          SELECT ?vuelo ?numeroVuelo ?nombreOrigen ?nombreDestino WHERE {
            ?vuelo rdf:type :Vuelo .
            OPTIONAL { ?vuelo :numeroVuelo ?numeroVuelo . }
            OPTIONAL {
              ?vuelo :tieneOrigen ?origen .
              ?origen :nombreAeropuerto ?nombreOrigen .
            }
            OPTIONAL {
              ?vuelo :tieneDestino ?destino .
              ?destino :nombreAeropuerto ?nombreDestino .
            }
          } LIMIT 12
        `);
        setVuelos(resultados.results.bindings);
        console.log("✅ Vuelos cargados:", resultados.results.bindings);
      } catch (error) {
        console.error("❌ Error al cargar vuelos:", error);
      }
    };
    obtenerVuelos();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Barra navegación */}
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

      {/* Encabezado búsqueda */}
      <section className="bg-blue-800 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Botones tipo de viaje */}
          <div className="flex gap-4 justify-start mb-6">
            {[{ key: "idaVuelta", label: "Ida y vuelta" }, { key: "soloIda", label: "Solo ida" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTipoViaje(key)}
                className={`px-4 py-2 rounded-full border ${tipoViaje === key ? "bg-white text-blue-700 font-semibold" : "bg-blue-700 border-white text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Formulario búsqueda */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-semibold">ORIGEN</label>
                <input
                  type="text"
                  placeholder="Ciudad de origen"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">DESTINO</label>
                <input
                  type="text"
                  placeholder="Ciudad de destino"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">FECHA IDA</label>
                <input
                  type="date"
                  value={fechaIda}
                  onChange={(e) => setFechaIda(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">FECHA VUELTA</label>
                <input
                  type="date"
                  value={fechaVuelta}
                  onChange={(e) => setFechaVuelta(e.target.value)}
                  disabled={tipoViaje !== "idaVuelta"}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${tipoViaje === "idaVuelta" ? "focus:ring-2 focus:ring-blue-400" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">PASAJEROS</label>
                <select
                  value={pasajeros}
                  onChange={(e) => setPasajeros(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} pasajero{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded shadow-md">Buscar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de vuelos */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Vuelos encontrados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vuelos.map((v, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <h3 className="text-sm text-gray-500 font-semibold mb-2">NÚMERO DE VUELO</h3>
              <p className="text-lg font-bold text-blue-600 mb-1">{v.numeroVuelo?.value || "-"}</p>
              <p className="text-sm text-gray-700">Partiendo desde: <span className="font-medium">{v.nombreOrigen?.value || "-"}</span></p>
              <p className="text-sm text-gray-700 mb-4">Destino: <span className="font-medium">{v.nombreDestino?.value || "-"}</span></p>
              <button className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2 rounded shadow">Ida y vuelta</button>
            </div>
          ))}
        </div>
      </section>

      {/* Promociones */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
          <h3 className="font-bold text-blue-600 text-lg mb-2">🌍 Vuelos internacionales</h3>
          <p className="text-sm text-gray-600 mb-4">Hasta $300.000 COP de descuento en vuelos al exterior.</p>
          <button className="text-blue-600 hover:underline font-medium text-sm">Ver más ofertas</button>
        </div>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
          <h3 className="font-bold text-blue-600 text-lg mb-2">🏖️ Paquetes al Caribe</h3>
          <p className="text-sm text-gray-600 mb-4">Hoteles y vuelos con hasta 40% de descuento.</p>
          <button className="text-blue-600 hover:underline font-medium text-sm">Explorar paquetes</button>
        </div>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
          <h3 className="font-bold text-blue-600 text-lg mb-2">✈️ Vuelos nacionales</h3>
          <p className="text-sm text-gray-600 mb-4">Reserva vuelos a cualquier ciudad de Colombia.</p>
          <button className="text-blue-600 hover:underline font-medium text-sm">Ver destinos</button>
        </div>
      </section>
    </div>
  );
}

export default Vuelos;
