const API_PATH = "/api-v2/";
const siteOrigin = window.location.origin;
const apiBase = `${siteOrigin}${API_PATH}`;

const urlForm = document.getElementById("urlForm");
const input = document.getElementById("urlInput");
const deleteForm = document.getElementById("deleteForm");
const deleteCode = document.getElementById("deleteCode");
const deleteKey = document.getElementById("deleteKey");
const resultDiv = document.getElementById("result");

async function readPayload(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    if (response.status === 204 || response.status === 205) {
      return {};
    }

    try {
      return await response.json();
    } catch (err) {
      throw new Error("Impossible de lire la réponse JSON du serveur");
    }
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

function normalizeCode(value) {
  if (!value) return "";
  let trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    trimmed = parsed.pathname;
  } catch (err) {
    if (!trimmed.startsWith("/")) {
      trimmed = `/${trimmed}`;
    }
  }

  if (trimmed.startsWith(API_PATH)) {
    trimmed = trimmed.slice(API_PATH.length);
  } else if (trimmed.startsWith("/")) {
    trimmed = trimmed.slice(1);
  }

  return trimmed.replace(/^\/+/, "").split("/")[0];
}

// Création d'un lien
urlForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = input.value.trim();
  if (!url) return;

  try {
    const response = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await readPayload(response);
    if (!response.ok) {
      resultDiv.innerHTML = `<p class="error">${data.error || "Erreur inconnue"}</p>`;
      return;
    }

    const shortURL = data.shortUrl || `${apiBase}${data.code}`;
    resultDiv.innerHTML = `
      <p>Lien raccourci : <a href="${shortURL}" target="_blank">${shortURL}</a></p>
      <p>Secret pour suppression : <strong>${data.secret}</strong></p>
      <button id="copyBtn">Copier l'URL</button>
    `;

    document.getElementById("copyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(shortURL);
      alert("URL copiée !");
    });

  } catch (err) {
    resultDiv.innerHTML = `<p class="error">Erreur réseau : ${err.message}</p>`;
  }
});

// Suppression d'un lien
deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const code = normalizeCode(deleteCode.value);
  const key = deleteKey.value.trim();
  if (!code || !key) return;

  try {
    const response = await fetch(`${apiBase}${code}`, {
      method: "DELETE",
      headers: { "Accept": "application/json", "X-API-Key": key }
    });

    const data = await readPayload(response);
    if (!response.ok) {
      resultDiv.innerHTML = `<p class="error">${data.error || data.message || "Erreur inconnue"}</p>`;
      return;
    }

    resultDiv.innerHTML = `<p>${data.message || "Lien supprimé."}</p>`;
  } catch (err) {
    resultDiv.innerHTML = `<p class="error">Erreur réseau : ${err.message}</p>`;
  }
});
