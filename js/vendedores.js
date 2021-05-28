// en estas const para manejar facilemtne la base de datos.
const database = firebase.database();
// referencia a la collection test_col para utilizar las funciones sobre esta colección
const rootRef = database.ref('/');
//
let jsonData = [];

// se agrega el listener al botón remove
function showData (){
    let html = '<ul>';

    jsonData.forEach(element => {
        html += '<li>'+ element.infoResult.data[0].slpName +'</li>'    
        
    });
    html += '</ul>';
    
    
    document.getElementById("demo").innerHTML = html;
    console.log(html);
    console.log(document.getElementById('demo'));
}
function getData (){
 // once() method
    rootRef.on('value',(snap)=>{
    jsonData = snap.val();
    console.log(jsonData);
  });
}

