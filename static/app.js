const originURL = "http://localhost:5000/api-v2/"; // mettre l'URL de ton serveur Node.js

const form = document.getElementById("urlForm");
const input = document.getElementById("urlInput");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = input.value.trim();
  if (!url) return;

  try {
    const response = await fetch(originURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      resultDiv.innerHTML = `<p class="error">${data.error || "Erreur inconnue"}</p>`;
      return;
    }

    const shortURL = `${originURL}${data.code}`;
    resultDiv.innerHTML = `
      <p>Lien raccourci : <a href="${shortURL}" target="_blank">${shortURL}</a></p>
      <button id="copyBtn">Copier l'URL</button>
    `;

    document.getElementById("copyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(shortURL);
      alert("URL copiée dans le presse-papier !");
    });

  } catch (err) {
    resultDiv.innerHTML = `<p class="error">Erreur réseau : ${err.message}</p>`;
  }
});
