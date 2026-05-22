import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN

const password = prompt("Contraseña");

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

  apiKey: "AIzaSyDVI76qVw8v00Kr6sG537oIP2yw4AdR5-g",
  authDomain: "contry-c4953.firebaseapp.com",
  projectId: "contry-c4953",
  storageBucket: "contry-c4953.firebasestorage.app",
  messagingSenderId: "775091873432",
  appId: "1:775091873432:web:93331d930a4aa1063c52ed"

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

const adminMain =
document.getElementById("adminMain");

const fechaActual =
document.getElementById("fechaActual");

const modoBtn =
document.getElementById("modoBtn");

const exportarPDF =
document.getElementById("exportarPDF");

// MENU

menuToggle.addEventListener("click", () => {

  sidebar.classList.toggle("hidden");

  adminMain.classList.toggle("expandido");

});

// DARK MODE

modoBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "modo",
    document.body.classList.contains("dark")
  );

});

if(localStorage.getItem("modo") === "true"){

  document.body.classList.add("dark");

}

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

// VARIABLES

let registros = [];

let sectorActual = "Campo";

// SECTORES

botonesSector.forEach((boton) => {

  boton.addEventListener("click", () => {

    botonesSector.forEach((b) => {

      b.classList.remove("active");

    });

    boton.classList.add("active");

    sectorActual =
    boton.dataset.sector;

    filtrar();

  });

});

// VER MAS

window.toggleTexto = function(id){

  document
  .getElementById(id)
  .classList
  .toggle("oculta");

};

// BORRAR

window.eliminarRegistro = async function(id){

  const confirmar =
  confirm("Eliminar informe?");

  if(!confirmar) return;

  await deleteDoc(
    doc(db,"registros",id)
  );

};

// CAMBIAR ESTADO

window.cambiarEstado = async function(id,estadoActual){

  const estados = [

    "Ok",
    "Observacion",
    "Urgente",
    "EnProceso",
    "Resuelto"

  ];

  let index =
  estados.indexOf(estadoActual);

  index++;

  if(index >= estados.length){
    index = 0;
  }

  await updateDoc(

    doc(db,"registros",id),

    {
      estado: estados[index]
    }

  );

};

// MOSTRAR

function mostrar(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
  lista.length;

  lista.forEach((registro,index) => {

    let colorEstado = "#3b82f6";

    if(registro.estado === "Observacion"){
      colorEstado = "#f59e0b";
    }

    if(registro.estado === "Urgente"){
      colorEstado = "#ef4444";
    }

    if(registro.estado === "EnProceso"){
      colorEstado = "#8b5cf6";
    }

    if(registro.estado === "Resuelto"){
      colorEstado = "#22c55e";
    }

    const textoId =
    "texto" + index;

    const textoLargo =
    registro.descripcion &&
    registro.descripcion.length > 180;

    contenedor.innerHTML += `

      <div class="registro-card">

        <div class="registro-header">

          <div>

            <h3>
              ${registro.nombre}
            </h3>

            <div class="sector-mini">
              ${registro.sector}
            </div>

          </div>

          <div class="estado"
               style="background:${colorEstado}">

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
            onclick="toggleTexto('${textoId}')"
          >

            Ver más

          </span>

        ` : ""}

        <div class="info">

          <span>
            📍 ${registro.coordenadas || "Sin ubicación"}
          </span>

          <span>
            🕒 ${registro.fecha || "Sin fecha"}
          </span>

        </div>

        <div class="fotos-grid">

          ${(registro.imagenes || [registro.imagen]).map((img) => `

            <a href="${img}"
               target="_blank">

              <img
                src="${img}"
                class="preview-img"
              >

            </a>

          `).join("")}

        </div>

        <div class="card-actions">

          <button
            class="btn-status"
            onclick="cambiarEstado('${registro.id}','${registro.estado}')"
          >

            Cambiar Estado

          </button>

          <button
            class="btn-delete"
            onclick="eliminarRegistro('${registro.id}')"
          >

            Eliminar

          </button>

        </div>

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
  registros.filter((r) => {

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

buscador.addEventListener("input", filtrar);

filtroEstado.addEventListener("change", filtrar);

filtroFecha.addEventListener("change", filtrar);

// PDF

exportarPDF.addEventListener("click", () => {

  window.print();

});

// FIREBASE

const q = query(

  collection(db,"registros")

);

onSnapshot(q, (snapshot) => {

  registros = [];

  snapshot.forEach((docu) => {

    registros.push({

      id: docu.id,
      ...docu.data()

    });

  });

  registros.reverse();

  filtrar();

});
