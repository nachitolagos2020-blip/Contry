import { initializeApp }

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
    r.nombre.toLowerCase().includes(texto);

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

// PDF

exportarPDF.addEventListener("click",()=>{

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  pdf.text("Informes Country",20,20);

  let y = 40;

  registros.forEach((r)=>{

    pdf.text(`${r.nombre} - ${r.estado}`,20,y);

    y += 10;

    if(y > 270){
      pdf.addPage();
      y = 20;
    }

  });

  pdf.save("informes.pdf");

});

// FIREBASE

const q = query(
  collection(db,"registros")
);

onSnapshot(q,(snapshot)=>{

  registros = [];

  snapshot.forEach((docu)=>{

    registros.push({
      id:docu.id,
      ...docu.data()
    });

  });

  registros.reverse();

  filtrar();

});
