// src/utils/sparqlInsert.js
export async function insertarEnOntologia(query) {
    const endpoint = "http://localhost:3030/aeropuerto/update"; // Ajusta el dataset si es diferente
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-update",
      },
      body: query,
    });
  
    if (!response.ok) {
      throw new Error("Error en la consulta SPARQL INSERT");
    }
  
    return response;
  }
  