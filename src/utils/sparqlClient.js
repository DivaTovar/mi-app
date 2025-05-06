// src/utils/sparqlClient.js
export async function consultarOntologia(consulta) {
    const endpoint = "https://f678-35-243-162-32.ngrok-free.app/aeropuerto/sparql"; // ✅ URL válida
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: "application/sparql-results+json",
      },
      body: consulta,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
  
    return response.json();
  }
  