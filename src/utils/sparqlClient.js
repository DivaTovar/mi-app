// src/utils/sparqlClient.js

export async function consultarOntologia(consulta) {
  const endpoint = "http://localhost:3030/aeropuerto/sparql";

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
