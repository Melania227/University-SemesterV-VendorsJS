/* FIREBASE */
// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');

/* WORKING WITH JSON INFORMATION */

$(document).ready(function(){
  //datatablePropierties();
});

function getData (){
    rootRef.on('value',(snap)=>{
      jsonData = snap.val();
      console.log(jsonData);
    });
  }

let jsonData = [];

// se agrega el listener al botón remove
function showData (){
    let idGuardadoEnLocal = localStorage.getItem("idUser");
    let dataUser = jsonData[idGuardadoEnLocal];
    console.log(dataUser);
    //document.getElementById('prueba').innerHTML = idGuardadoEnLocal;
}

