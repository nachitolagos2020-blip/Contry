
const contenedor =
  document.getElementById("contenedorRegistros");

const buscador =
  document.getElementById("buscador");

const totalRegistros =
  document.getElementById("totalRegistros");

let registros =
  JSON.parse(localStorage.getItem("registros")) || [];

totalRegistros.innerHTML =
  registros.length;

// MOSTRAR

function mostrarRegistros(lista){

  contenedor.innerHTML = "";

  lista.forEach((registro) => {

    let claseEstado = "ok";

    if(registro.estado === "Observacion"){
      claseEstado = "observacion";
    }

    if(registro.estado === "Urgente"){
      claseEstado = "urgente";
    }

    // SACAR COORDENADAS

    let coords = "Sin ubicación";

    if(registro.ubicacion){

      coords =
        registro.ubicacion
          .replace("https://maps.google.com/?q=","");

    }

    contenedor.innerHTML += `

      <div class="registro-card">

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <span class="estado ${claseEstado}">
              ${registro.estado}
            </span>

          </div>

          <div class="fecha">
            ${registro.fecha}
          </div>

        </div>

        <div class="registro-grid">

          <div class="registro-box">

            <div class="titulo-box">
              Observaciones
            </div>

            <p>
              ${registro.descripcion}
            </p>

          </div>

          <div class="registro-box">

            <div class="titulo-box">
              Coordenadas
            </div>

            <p>
              ${coords}
            </p>

          </div>

        </div>

        <img
          src="${registro.imagen}"
          class="registro-img"
          onclick="window.open('${registro.imagen}')"
        >

      </div>

    `;

  });

}

mostrarRegistros(registros);

// BUSCADOR

buscador.addEventListener("input", () => {

  const valor =
    buscador.value.toLowerCase();

  const filtrados = registros.filter((r) =>

    r.nombre.toLowerCase().includes(valor)

  );

  mostrarRegistros(filtrados);

});