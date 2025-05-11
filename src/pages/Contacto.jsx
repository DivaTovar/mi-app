function Contacto() {
    return (
      <div className="min-h-screen bg-blue-50 font-sans">
        {/* NAVBAR IGUAL QUE VUELOS */}
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
  
        {/* CONTENIDO CONTACTO */}
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center mb-6">
            <img src="/Logo_IMG.png" alt="Logo" className="h-16 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-blue-700">Centro de Ayuda ✈️</h1>
            <p className="text-gray-600 mt-2">
              Encuentra respuestas rápidas o ponte en contacto con nosotros.
            </p>
          </div>
  
          {/* BLOQUES DE AYUDA */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="p-5 bg-blue-100 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">📄 Consultas generales</h2>
              <p className="text-sm text-gray-700">
                Información sobre vuelos, itinerarios, cambios y políticas generales.
              </p>
            </div>
  
            <div className="p-5 bg-blue-100 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">💼 Equipaje perdido</h2>
              <p className="text-sm text-gray-700">
                ¿Tu equipaje no llegó? Aquí te explicamos cómo rastrearlo.
              </p>
            </div>
  
            <div className="p-5 bg-blue-100 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">🧾 Reclamos</h2>
              <p className="text-sm text-gray-700">
                Presenta un reclamo por vuelos cancelados o demoras injustificadas.
              </p>
            </div>
  
            <div className="p-5 bg-blue-100 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">📞 Soporte directo</h2>
              <p className="text-sm text-gray-700">
                Llámanos o escríbenos para asistencia personalizada.
              </p>
            </div>
          </div>
  
          {/* DATOS DE CONTACTO */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-blue-700 font-bold text-lg mb-2">📬 Contáctanos directamente</h3>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>📧 <strong>Email:</strong> soporte@aeropuertos.com</li>
              <li>📱 <strong>Teléfono:</strong> +57 320 123 4567</li>
              <li>📍 <strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default Contacto;
  