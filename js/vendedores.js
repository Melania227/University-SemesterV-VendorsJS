/* FIREBASE */
// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');

/* WORKING WITH JSON INFORMATION */

$(document).ready(function(){
  getData();
});


/* ---------------------------------------------------------- PROMESA ------------------------------------------------------------- */
function getDataPromise(){
	return new Promise((resolve, reject)=>{

    rootRef.on('value',(snap)=>{
      resolve (snap.val());
    });
        
  });
}

let jsonData = [];
async function getData(){
  await getDataPromise()
  .then(
        json=>{
          jsonData=json;
          showData ();
        }
  )
  .catch(error=>{console.log(error)});
}

/* function getData (){
  rootRef.on('value',(snap)=>{
    jsonData = snap.val();
  });
} */


function showData (){
  
  let htmlTable = '';
  let idNum = 0;

  jsonData.forEach(vendedor => {
      htmlTable += '<tr vendedorID = "' + idNum + '">';
      htmlTable += '<td class="text-truncate text-center">' + vendedor.infoResult.data[0].slpName + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + newFormat.format(vendedor.infoResult.data[0].sale) + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + newFormat.format(vendedor.infoResult.data[0].budget) + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + ((vendedor.infoResult.data[0].sale - vendedor.infoResult.data[0].budget)<0?(newFormat.format(vendedor.infoResult.data[0].sale - vendedor.infoResult.data[0].budget)):(newFormat.format(vendedor.infoResult.data[0].sale - vendedor.infoResult.data[0].budget))) + '</td>';
      htmlTable += porcentajeCumplimiento(vendedor.infoResult.data[0].sale, vendedor.infoResult.data[0].budget);
      htmlTable += '<td class="text-truncate text-center"><button class="btn" id="btnPlaneID" onClick="dashboard('+ idNum +')"><i class="fas fa-paper-plane"></i></button></td>';
      htmlTable += '</tr>';
      idNum+=1;
    });    
  document.getElementById('vendedorTableBodyID').innerHTML = htmlTable;
  $('#vendedoresTables').DataTable().destroy();
  datatablePropierties();
  /* $('#vendedorTableBodyID').html = htmlTable; */
}


function datatablePropierties(){
  $('#vendedorTableID').DataTable({
    "bSort": true,
    "paging":true,
    
    "language": {
      "search": "Buscar",
      "paginate":{
        "show": "Mostrando",
        "first": "Primer",
        "previous": "Anterior",
        "next": "Siguiente",
        "last": "Ultimo"
      },
      "info": "Mostrando vendedores del _START_ al _END_ de _TOTAL_ disponibles",
      "infoEmpty": "No hay datos",
      "emptyTable": "No hay datos por el momento",
      "lengthMenu": "Mostrando _MENU_ entradas"
    }
  });
}

function porcentajeCumplimiento(venta, meta){
  if (meta===0){
    return '<td class="text-truncate text-center">No hay meta disponible</td>';
  }
  else{
    let porcentaje = ((venta / meta)*100).toFixed(1);
    if(porcentaje>=100){
      return '<td class="text-truncate text-center"><span class="badge" style="background-color:#1DB954">' + porcentaje +'%</span></td>'
    }
    else if(porcentaje>=80){
      return '<td class="text-truncate text-center"><span class="badge" style="background-color:yellow; color:black">' + porcentaje +'%</span></td>'
    }
    return '<td class="text-truncate text-center"><span class="badge" style="background-color:red">' + porcentaje +'%</span></td>'
  }
}

function dashboard(id){
  localStorage.setItem('idUser', id);
  window.document.location = './dashboard.html';
}

const newFormat = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0
})

