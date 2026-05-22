import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  collection,
  onSnapshot,
  query

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN

const password =
  prompt("Contraseña");

if(password !== "country2026"){

  document.body.innerHTML = `
    <div class="login-error">
      Contraseña incorrecta
    </div>
  `;

  throw new Error("Sin acceso");

}

// FIREBASE

const firebaseConfig = {

  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMAIN",
  projectId: "TU_PROJECT_ID"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ELEMENTOS

const contenedor =
document.getElementById("contenedorRegistros");

const totalRegistros =
document.getElementById("totalRegistros");

const buscador =
document.getElementById("buscador");

const filtroEstado =
document.getElementById("filtroEstado");

const filtroFecha =
document.getElementById("filtroFecha");

const botonesSector =
document.querySelectorAll(".sector-btn");

const sidebar =
document.getElementById("sidebar");

const menuToggle =
document.getElementById("menuToggle");

const fechaActual =
document.getElementById("fechaActual");

const exportarSeleccionados =
document.getElementById("exportarSeleccionados");

const borrarSeleccionados =
document.getElementById("borrarSeleccionados");

const themeToggle =
document.getElementById("themeToggle");

// VARIABLES

let registros = [];

let seleccionados = [];

let sectorActual = "Campo";

// MENU

menuToggle.addEventListener("click",()=>{

  sidebar.classList.toggle("hidden");

});

// DARK MODE

themeToggle.addEventListener("change",()=>{

  document.body.classList.toggle("dark");

});

// FECHA

function actualizarHora(){

  const ahora = new Date();

  fechaActual.innerHTML =

    ahora.toLocaleDateString("es-AR") +

    " • " +

    ahora.toLocaleTimeString("es-AR",{

      hour:"2-digit",
      minute:"2-digit"

    });

}

setInterval(actualizarHora,1000);

actualizarHora();

// SECTORES

botonesSector.forEach((boton)=>{

  boton.addEventListener("click",()=>{

    botonesSector.forEach((b)=>{

      b.classList.remove("active");

    });

    boton.classList.add("active");

    sectorActual =
    boton.dataset.sector;

    filtrar();

  });

});

// EXPANDIR TEXTO

window.toggleTexto = function(textoId,cardId){

  const texto =
  document.getElementById(textoId);

  const card =
  document.getElementById(cardId);

  texto.classList.toggle("oculta");

  card.classList.toggle("expandido");

};

// SELECCIONAR

window.toggleSeleccion = function(id){

  if(seleccionados.includes(id)){

    seleccionados =
    seleccionados.filter(
      item => item !== id
    );

  }else{

    seleccionados.push(id);

  }

};

// MOSTRAR

function mostrar(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
  lista.length;

  lista.forEach((registro,index)=>{

    let colorEstado = "#22c55e";

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

    if(registro.estado === "En Proceso"){
      colorEstado = "#9333ea";
    }

    if(registro.estado === "Resuelto"){
      colorEstado = "#22c55e";
    }

    const textoId =
    "texto" + index;

    const cardId =
    "card" + index;

    const textoLargo =
    registro.descripcion &&
    registro.descripcion.length > 180;

    contenedor.innerHTML += `

      <div class="registro-card"
           id="${cardId}">

        <input
          type="checkbox"
          class="select-registro"
          onchange="toggleSeleccion('${registro.fecha}')"
        >

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <div
            class="estado"
            style="background:${colorEstado}"
          >

            ${registro.estado}

          </div>

        </div>

        <div
          class="descripcion ${textoLargo ? "oculta" : ""}"
          id="${textoId}"
        >

          ${registro.descripcion}

        </div>

        ${textoLargo ? `

          <span
            class="ver-mas"
            onclick="toggleTexto('${textoId}','${cardId}')"
          >

            Ver más

          </span>

        ` : ""}

        <div class="info">

          <span>
            📍 ${registro.coordenadas}
          </span>

          <span>
            🕒 ${registro.fecha}
          </span>

        </div>

        ${registro.imagen ? `

          <div class="foto-box">

            <img
              src="${registro.imagen}"
              class="preview-img"
            >

            <a
              href="${registro.imagen}"
              target="_blank"
              class="ver-foto"
            >

              Ver Imagen

            </a>

          </div>

        ` : ""}

      </div>

    `;

  });

}

// FILTRAR

function filtrar(){

  const texto =
  buscador.value.toLowerCase();

  const estado =
  filtroEstado.value;

  const fecha =
  filtroFecha.value;

  const filtrados =
  registros.filter((r)=>{

    const coincideNombre =

      r.nombre
      .toLowerCase()
      .includes(texto);

    const coincideSector =

      r.sector === sectorActual;

    const coincideEstado =

      estado === "Todos" ||

      r.estado === estado;

    let coincideFecha = true;

    if(fecha){

      coincideFecha =
      r.fecha &&
      r.fecha.includes(fecha);

    }

    return (

      coincideNombre &&
      coincideSector &&
      coincideEstado &&
      coincideFecha

    );

  });

  mostrar(filtrados);

}

// EVENTOS

buscador.addEventListener("input",filtrar);

filtroEstado.addEventListener("change",filtrar);

filtroFecha.addEventListener("change",filtrar);

// FECHAS

function generarFechas(){

  const hoy =
  new Date();

  const fin =
  new Date("2026-12-31");

  while(hoy <= fin){

    const fecha =

    hoy.toISOString().split("T")[0];

    filtroFecha.innerHTML += `

      <option value="${fecha}">
        ${fecha}
      </option>

    `;

    hoy.setDate(
      hoy.getDate() + 1
    );

  }

}

generarFechas();

// EXPORTAR

exportarSeleccionados
.addEventListener("click",()=>{

  const seleccion =
  registros.filter((r)=>

    seleccionados.includes(r.fecha)

  );

  console.log(seleccion);

  alert(
    "Seleccionados: " +
    seleccion.length
  );

});

// ELIMINAR

borrarSeleccionados
.addEventListener("click",()=>{

  registros =
  registros.filter((r)=>

    !seleccionados.includes(r.fecha)

  );

  seleccionados = [];

  filtrar();

});

// FIREBASE

const q = query(
  collection(db,"registros")
);

onSnapshot(q,(snapshot)=>{

  registros = [];

  snapshot.forEach((doc)=>{

    registros.push(doc.data());

  });

  registros.reverse();

  filtrar();

});
