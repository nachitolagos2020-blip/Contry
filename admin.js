let modoSeleccionActivo = false;
let seleccionados = new Set();

const barraSeleccion =
document.getElementById("barraSeleccion");

const cantidadSeleccionados =
document.getElementById("cantidadSeleccionados");

const modoSeleccionBtn =
document.getElementById("modoSeleccion");

const eliminarSeleccionadosBtn =
document.getElementById("eliminarSeleccionados");

// ACTIVAR SELECCION

if(modoSeleccionBtn){

  modoSeleccionBtn.addEventListener("click",()=>{

    modoSeleccionActivo =
    !modoSeleccionActivo;

    seleccionados.clear();

    actualizarBarraSeleccion();

    filtrar();

  });

}

// ELIMINAR MASIVO

if(eliminarSeleccionadosBtn){

  eliminarSeleccionadosBtn.addEventListener("click",async()=>{

    if(seleccionados.size === 0) return;

    const confirmar =
    confirm(`Eliminar ${seleccionados.size} informes?`);

    if(!confirmar) return;

    for(const id of seleccionados){

      await deleteDoc(
        doc(db,"registros",id)
      );

    }

    seleccionados.clear();

    actualizarBarraSeleccion();

  });

}

function actualizarBarraSeleccion(){

  if(!barraSeleccion) return;

  cantidadSeleccionados.innerHTML =
  seleccionados.size;

  barraSeleccion.style.display =

    seleccionados.size > 0
    ? "flex"
    : "none";

}

window.toggleSeleccion = function(id){

  if(seleccionados.has(id)){

    seleccionados.delete(id);

  }else{

    seleccionados.add(id);

  }

  actualizarBarraSeleccion();

};

window.abrirImagen = function(url){

  const modal =
  document.getElementById("imageModal");

  const imagen =
  document.getElementById("modalImage");

  imagen.src = url;

  modal.style.display = "flex";

};

const closeModal =
document.getElementById("closeModal");

if(closeModal){

  closeModal.onclick = () => {

    document.getElementById("imageModal")
    .style.display = "none";

  };

}

function obtenerClaseEstado(estado){

  switch(estado){

    case "Ok":
      return "ok";

    case "Observacion":
      return "obs";

    case "Urgente":
      return "urg";

    case "EnProceso":
      return "proc";

    case "Resuelto":
      return "res";

    default:
      return "ok";

  }

}

function mostrar(lista){

  contenedor.innerHTML = "";

  totalRegistros.innerHTML =
  lista.length;

  lista.forEach((registro)=>{

    const imagenes =
    registro.imagenes ||
    (registro.imagen
      ? [registro.imagen]
      : []);

    const fila = document.createElement("div");

    fila.className = "registro-row";

    fila.innerHTML = `

      <div>

        ${
          modoSeleccionActivo
          ?

          `<input
            type="checkbox"
            ${
              seleccionados.has(registro.id)
              ? "checked"
              : ""
            }
            onchange="toggleSeleccion('${registro.id}')"
          >`

          : ""

        }

        <strong>

          ${escapeHTML(
            registro.nombre || ""
          )}

        </strong>

      </div>

      <div>
        ${escapeHTML(
          registro.sector || ""
        )}
      </div>

      <div>

        <span class="badge ${obtenerClaseEstado(registro.estado)}">

          ${registro.estado || "Ok"}

        </span>

      </div>

      <div>

        ${registro.fecha || "-"}

      </div>

      <div>

        ${registro.coordenadas || "-"}

      </div>

      <div>

        ${
          imagenes.length

          ?

          `<img
            src="${imagenes[0]}"
            class="preview-img"
            onclick="abrirImagen('${imagenes[0]}')"
          >`

          :

          "-"

        }

      </div>

      <div class="action-group">

        <button
          class="btn-status"
          onclick="cambiarEstado(
            '${registro.id}',
            '${registro.estado}'
          )"
        >

          Estado

        </button>

        <button
          class="btn-delete"
          onclick="eliminarRegistro(
            '${registro.id}'
          )"
        >

          Borrar

        </button>

      </div>

    `;

    contenedor.appendChild(fila);

  });

  document.addEventListener("click",(e)=>{

  const modal =
  document.getElementById("imageModal");

  if(
    modal &&
    e.target === modal
  ){

    modal.style.display = "none";

  }

});
}
