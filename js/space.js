document.addEventListener("DOMContentLoaded", function () {
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const contenedor = document.getElementById("contenedor");

  async function buscarImagenes() {
    const busqueda = inputBuscar.value.trim();
    if (busqueda === "") return;

    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(busqueda)}`
      );
      const data = await response.json();

      contenedor.innerHTML = "";

      if (data.collection.items.length === 0) {
        contenedor.innerHTML =
          '<p class="text-center text-light">No se encontraron resultados.</p>';
        return;
      }

      let row = document.createElement("div");
      row.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4";
      contenedor.appendChild(row);

      data.collection.items.forEach((item) => {
        const {
          links,
          data: [itemData],
        } = item;
        const { title, description, date_created } = itemData;
        const imageUrl = links?.[0]?.href;

        const cardHtml = `
                    <div class="col">
                        <div class="card h-100 bg-dark text-light">
                            <img src="${imageUrl}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${title}</h5>
                                <div class="card-text description-container">
                                    <p>${description}</p>
                                </div>
                                <p class="card-text mt-auto"><small class="text-muted">Fecha: ${new Date(
                                  date_created
                                ).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                `;

        row.innerHTML += cardHtml;
      });
    } catch (error) {
      console.error("Error al buscar imágenes:", error);
      contenedor.innerHTML =
        '<p class="text-center text-light">Ocurrió un error al buscar las imágenes. Por favor, intenta de nuevo más tarde.</p>';
    }
  }

  btnBuscar.addEventListener("click", buscarImagenes);

  inputBuscar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      buscarImagenes();
    }
  });
});
