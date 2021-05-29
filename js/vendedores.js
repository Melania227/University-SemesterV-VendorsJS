/* FIREBASE */
// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');

/* WORKING WITH JSON INFORMATION */

$(document).ready(function(){
  //datatablePropierties();
});

let jsonData = [];

// se agrega el listener al botón remove
function showData (){
  
  let htmlTable = '';

  jsonData.forEach(vendedor => {
      htmlTable += '<tr vendedorID = "' + vendedor.infoResult.data[0].username + '">';
      htmlTable += '<td class="text-truncate text-center">' + vendedor.infoResult.data[0].slpName + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + vendedor.infoResult.data[0].sale + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + vendedor.infoResult.data[0].budget + '</td>';
      htmlTable += '<td class="text-truncate text-center">' + (vendedor.infoResult.data[0].sale - vendedor.infoResult.data[0].budget) + '</td>';
      vendedor.infoResult.data[0].budget===0?htmlTable +='<td class="text-truncate text-center">No hay meta disponible</td>':htmlTable += '<td class="text-truncate text-center">' + Math.round((vendedor.infoResult.data[0].sale / vendedor.infoResult.data[0].budget)*100) + "%" + '</td>';
      htmlTable += '<td class="text-truncate text-center"><button class="btn" id="btnPlaneID"><i class="fas fa-paper-plane"></i></button></td>';
      htmlTable += '</tr>';
  });    
  document.getElementById('vendedorTableBodyID').innerHTML = htmlTable;
  $('#vendedoresTables').DataTable().destroy();
  datatablePropierties();
  /* $('#vendedorTableBodyID').html = htmlTable; */
}

function getData (){
  rootRef.on('value',(snap)=>{
    jsonData = snap.val();
    console.log(jsonData);
  });
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
      "info": "Mostrando página _PAGE_ de _PAGES_",
      "infoEmpty": "No hay datos",
      "emptyTable": "No hay datos por el momento"
    }
  });
}



