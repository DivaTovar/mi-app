import { URL_FUSEKI } from "../config/envs";

export async function insertarEnOntologia(query) {
  const endpoint = `${URL_FUSEKI}/aeropuerto/update`;


  console.log("📤 SPARQL insert:\n", query); // 👈 Ver el query enviado

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-update",
    },
    body: query,
  });

  if (!response.ok) {
    const errorText = await response.text(); // 👈 Esto captura el texto real
    console.error("❌ ERROR SPARQL:\n", errorText); // 👈 Imprimirlo en consola
  }

  return response;
}
