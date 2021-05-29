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

var options = {
    series: [{
    name: 'Meta',
    data: [44.6, 55.6, 50.6, 56.6, 61.6, 58, 63, 60, 66]
  }, {
    name: 'Venta',
    data: [76, 43, 76, 21, 43, 13, 62, 14, 63]
  }, {
    name: 'Año anterior',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  },{
    name: 'Mes anterior',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }],
    chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
  },
  yaxis: {
    title: {
      text: '₡ Millones'
    },
    min: 0,
    max: 80,
    tickAmount: 8
  },
  fill: {
    opacity: 1,
    colors: ['#1db954','#80b921','#c2b400','#ffa600']
  },
  markers: {
    colors: ['#1db954','#80b921','#c2b400','#ffa600']
  },
  colors:['#1db954','#80b921','#c2b400','#ffa600'],
  tooltip: {
    y: {
      formatter: function (val) {
        return "₡ " + val + " thousands"
      }
    }
  }
};

var chart = new ApexCharts(document.querySelector("#barGraphic"), options);
chart.render();

var options = {
    series: [70],
    chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '50%',
      }
    },
  },
  colors:['#1db954'],
  labels: ['Cumplimiento'],
  };

var chart = new ApexCharts(document.querySelector("#cicularGraphic1"), options);
chart.render();

var options = {
  series: [55],
  chart: {
  height: 350,
  type: 'radialBar'
},
plotOptions: {
  radialBar: {
    hollow: {
      size: '50%',
    }
  },
},
colors:['#80b921'],
labels: ['Proyectado'],
};

var chart = new ApexCharts(document.querySelector("#cicularGraphic2"), options);
chart.render();