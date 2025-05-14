// src/utils/sparqlClient.js
import { URL_FUSEKI } from "../config/envs";

export async function consultarOntologia(consulta) {
  const endpoint = `${URL_FUSEKI}/aeropuerto/query`;

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
