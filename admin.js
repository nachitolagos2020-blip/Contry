import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */
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

/* ELEMENTOS (IGUAL QUE TUYO) */
const contenedor = document.getElementById("contenedorRegistros");
const totalRegistros = document.getElementById("totalRegistros");
const buscador = document.getElementById("buscador");
const filtroEstado = document.getElementById("filtroEstado");
const filtroFecha = document.getElementById("filtroFecha");
const botonesSector = document.querySelectorAll(".sector-btn");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const fechaActual = document.getElementById("fechaActual");
const modoBtn = document.getElementById("modoBtn");
const exportarPDF = document.getElementById("exportarPDF");

let registros = [];
let sectorActual = "Campo";

/* MENU */
menuToggle.onclick = () => {
  sidebar.classList.toggle("hidden");
};

/* DARK MODE */
modoBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("modo", document.body.classList.contains("dark"));
};

if(localStorage.getItem("modo") === "true"){
  document.body.classList.add("dark");
}

/* FECHA */
setInterval(() => {
  const ahora = new Date();
  fechaActual.textContent =
    ahora.toLocaleDateString("es-AR") +
    " • " +
    ahora.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
},1000);

/* 🔐 FIX SEGURIDAD HTML */
function limpiarHTML(texto = ""){
  return String(texto)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

/* DELETE */
window.eliminarRegistro = async (id) => {
  try {
    await deleteDoc(doc(db,"registros",id));
  } catch (e) {
    alert("Error al eliminar");
  }
};

/* CAMBIAR ESTADO */
window.cambiarEstado = async (id,estado) => {
  const estados = ["Ok","Observacion","Urgente","EnProceso","Resuelto"];

  let i = estados.indexOf(estado);
  i = (i + 1) % estados.length;

  try {
    await updateDoc(doc(db,"registros",id),{
      estado: estados[i]
    });
  } catch(e){
    alert("Error al actualizar estado");
  }
};

/* RENDER OPTIMIZADO (MISMO DISEÑO) */
function mostrar(lista){

  let html = "";

  totalRegistros.textContent = lista.length;

  lista.forEach(r => {

    const imgs = r.imagenes || (r.imagen ? [r.imagen] : []);

    html += `
      <div class="registro-card">

        <div class="registro-header">

          <div>
            <h3>${limpiarHTML(r.nombre || "")}</h3>
            <div class="sector-mini">${limpiarHTML(r.sector || "")}</div>
          </div>

          <div class="estado">
            ${limpiarHTML(r.estado || "")}
          </div>

        </div>

        <div class="descripcion">
          ${limpiarHTML(r.descripcion || "")}
        </div>

        <div class="info">
          <span>📍 ${limpiarHTML(r.coordenadas || "Sin ubicación")}</span>
          <span>🕒 ${limpiarHTML(r.fecha || "Sin fecha")}</span>
        </div>

        <div class="fotos-grid">
          ${imgs.map(img => `
            <a href="${img}" target="_blank">
              <img src="${img}" class="preview-img">
            </a>
          `).join("")}
        </div>

        <div class="card-actions">

          <button class="btn-status"
            onclick="cambiarEstado('${r.id}','${r.estado}')">
            Cambiar Estado
          </button>

          <button class="btn-delete"
            onclick="eliminarRegistro('${r.id}')">
            Eliminar
          </button>

        </div>

      </div>
    `;
  });

  contenedor.innerHTML = html;
}

/* FILTRO (MISMO SISTEMA TUYO) */
function filtrar(){

  const texto = buscador.value.toLowerCase();

  const filtrados = registros.filter(r =>
    r.sector === sectorActual &&
    (filtroEstado.value === "Todos" || r.estado === filtroEstado.value) &&
    (r.nombre || "").toLowerCase().includes(texto)
  );

  mostrar(filtrados);
}

/* EVENTS */
buscador.oninput = filtrar;
filtroEstado.onchange = filtrar;

botonesSector.forEach(b => {
  b.onclick = () => {
    botonesSector.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    sectorActual = b.dataset.sector;
    filtrar();
  };
});

/* FIREBASE REALTIME */
const q = query(collection(db,"registros"));

onSnapshot(q,(snap)=>{
  registros = [];
  snap.forEach(d => registros.push({id:d.id,...d.data()}));
  registros.reverse();
  filtrar();
});
