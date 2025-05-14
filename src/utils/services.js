// src/utils/services.js

// 🔐 Supabase configuración
const SUPABASE_URL = "https://mafrqpqovtomckdevjpf.supabase.co/rest/v1/usuarios?select=id,nombre,correo";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZnJxcHFvdnRvbWNrZGV2anBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzU5MDEsImV4cCI6MjA2MTk1MTkwMX0.SE8h778-KCbUGZw3fkyV7a8wYcsWTx-sMyBamajg4Cs";

// 🔹 Obtener usuarios desde Supabase
export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(SUPABASE_URL, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    return [];
  }
};

// 🔹 Consultar vuelos (SPARQL)
export const consultarVuelos = () => `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX : <http://www.semanticweb.org/aeropuerto#>
  SELECT ?vuelo ?numero ?origen ?destino ?fecha ?estado ?aerolinea WHERE {
    ?vuelo rdf:type :Vuelo .
    OPTIONAL { ?vuelo :numeroVuelo ?numero . }
    OPTIONAL { ?vuelo :tieneOrigen/:ciudadAeropuerto ?origen . }
    OPTIONAL { ?vuelo :tieneDestino/:ciudadAeropuerto ?destino . }
    OPTIONAL { ?vuelo :fechaVuelo ?fecha . }
    OPTIONAL { ?vuelo :estadoVuelo ?estado . }
    OPTIONAL { ?a :operaVuelo ?vuelo . ?a :nombreAerolinea ?aerolinea . }
  }
`;

// 🔹 Consultar aerolíneas (SPARQL)
export const consultarAerolineas = () => `
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

// 🔹 Insertar vuelo (SPARQL)
export const insertarVueloQuery = ({ id, numeroVuelo, origen, destino, fechaISO }) => `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX : <http://www.semanticweb.org/aeropuerto#>
  INSERT DATA {
    :${id} rdf:type :Vuelo ;
      :numeroVuelo "${numeroVuelo}" ;
      :tieneOrigen [ :ciudadAeropuerto "${origen}" ] ;
      :tieneDestino [ :ciudadAeropuerto "${destino}" ] ;
      :fechaVuelo "${fechaISO}"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
      :estadoVuelo "Programado" .
  }
`;

// 🔹 Actualizar estado de vuelo
export const actualizarVueloQuery = (uri, nuevoEstado) => `
  PREFIX : <http://www.semanticweb.org/aeropuerto#>
  DELETE { <${uri}> :estadoVuelo ?estadoAnterior . }
  INSERT { <${uri}> :estadoVuelo "${nuevoEstado}" . }
  WHERE { OPTIONAL { <${uri}> :estadoVuelo ?estadoAnterior . } }
`;


// 🔹 Eliminar recurso (vuelo o aerolínea)
export const eliminarRecursoQuery = (uri) => `
  PREFIX : <http://www.semanticweb.org/aeropuerto#>
  DELETE WHERE { <${uri}> ?p ?o . }
`;

// 🔹 Insertar aerolínea (SPARQL)
export const insertarAerolineaQuery = ({ id, nombre, codigoAOC, tipoAeronave, fechaISO }) => `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX : <http://www.semanticweb.org/aeropuerto#>
  INSERT DATA {
    :${id} rdf:type :Aerolinea ;
      :idAerolinea "id${id}" ;
      :nombreAerolinea "${nombre}" ;
      :codigoAOC "${codigoAOC}" ;
      :tipoAeronaveOperada "${tipoAeronave}" ;
      :fechaRegistro "${fechaISO}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
  }
`;