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
    //let dataUser = jsonData[idGuardadoEnLocal];
    let dataUser = jsonData[0];
    
    displayBarGraphic(dataUser);
    displayRadialGraphicCumplimiento(dataUser);
    displayRadialGraphicProyectado(dataUser);
    displayPedidosAndCotizaciones(dataUser);
    //document.getElementById('prueba').innerHTML = idGuardadoEnLocal;
}

/* --------------------------------------- BAR GRAPHIC ------------------------------------ */
function displayBarGraphic(infoUser){
  let moneyData = getRightDataForBars(infoUser);
  displayActualMoney(infoUser); 
  console.log(moneyData);
  var options = {
    series: [{
        name: 'Meta',
        data: moneyData[0]
      }, 
      {
        name: 'Venta',
        data: moneyData[1]
      }, 
      {
        name: 'Año anterior',
        data: moneyData[2]
      },
      {
        name: 'Mes anterior',
        data: moneyData[3]
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
      colors: ['#E27D60', '#85DCB0','#E8A87C','#C38D9E']
    },
    markers: {
      colors: ['#E27D60', '#85DCB0','#E8A87C','#C38D9E']
    },
    colors:['#E27D60', '#85DCB0','#E8A87C','#C38D9E'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val===1?"₡ " + val + " millón":"₡ " + val + " millones";
        }
      }
    }
  };

  var chart = new ApexCharts(document.querySelector("#barGraphic"), options);
  chart.render();
}

const newFormat = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  minimumFractionDigits: 0
})

function displayActualMoney(infoUser){
  let meta = newFormat.format(infoUser.infoResult.data[0].budget);
  let venta = newFormat.format(infoUser.infoResult.data[0].sale);
  let diferencia = newFormat.format(infoUser.infoResult.data[0].sale-infoUser.infoResult.data[0].budget);
  let strHTML = '';
  strHTML+='<p>Venta actual <br>' + venta + '</p>';
  strHTML+='<p>Meta actual <br>' + meta + '</p>';
  strHTML+='<p>Diferencia <br>' + diferencia + '</p>';
  document.getElementById('actualMoneyData').innerHTML=strHTML;
}

/*----------------------------------- RADIAL GRAPHIC -----------------------------------------*/
function displayRadialGraphicCumplimiento(userInfo){
  let percentageNum = userInfo.infoResult.data[0].budget===0?0:((userInfo.infoResult.data[0].sale / userInfo.infoResult.data[0].budget)*100).toFixed(1);
  var options = {
    series: [percentageNum],
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
  colors:['#85DCB0'],
  labels: ['Cumplimiento'],
  };
  
  var chart = new ApexCharts(document.querySelector("#cicularGraphic1"), options);
  chart.render();
}

function displayRadialGraphicProyectado(userInfo){
  let percentageNum = (getRightDataForRadial(userInfo)).toFixed(1);
  var options = {
    series: [percentageNum],
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
    colors:['#E8A87C'],
    labels: ['Proyectado'],
    };
    
    var chart = new ApexCharts(document.querySelector("#cicularGraphic2"), options);
    chart.render();
}

/*---------------------------- DISPLAY DE PEDIDOS Y COTIZACIONES --------------------------------*/
function displayPedidosAndCotizaciones(userInfo){
  let salesOrders = newFormat.format(userInfo.infoResult.data[0].salesOrders);
  let quotationsOrders = newFormat.format(userInfo.infoResult.data[0].quotations);
  let strHTMLSales = '<p>'+salesOrders+'</p>';
  let strHTMLQuotations = '<p>'+quotationsOrders+'</p>';
  document.getElementById('pedidosID').innerHTML=strHTMLSales;
  document.getElementById('cotizacionesID').innerHTML=strHTMLQuotations;
}

/*---------------------------- CALCULOS PARA EL GRAFICO DE BARRAS --------------------------------*/

function getRightDataForBars(userInfo){
  let weeksWeight = getWeekWeights(userInfo);
  let metasEachWeek = getMetasPerWeek(userInfo, weeksWeight);
  let salesEachWeek = getSalesPerWeek(userInfo);
  let salesEachWeekPastYear = getSalesPerWeekPastYear(userInfo, weeksWeight);
  let salesEachWeekPastMonth = getSalesPerWeekPastMonth(userInfo, weeksWeight);
  let result = [];
  result.push(metasEachWeek);
  result.push(salesEachWeek);
  result.push(salesEachWeekPastYear);
  result.push(salesEachWeekPastMonth);
  console.log(weeksWeight);
  console.log(result);
  return result;
}

function getWeekWeights(userInfo){
  let weeksWeight = [];
  for (let i = 0; i < userInfo.weekResult.data.length; i++) {
    let weekWeightSum = 0;
    for (let j = 0; j <= i; j++) {
      weekWeightSum+=userInfo.weekResult.data[j].weekWeight;
    }
    weeksWeight.push(weekWeightSum/100);
  }
  return weeksWeight;
}

function getMetasPerWeek(userInfo, weights){
  let metasResult = [];
  for (let i = 0; i < weights.length; i++) {
    metasResult.push(((userInfo.infoResult.data[0].budget*weights[i])/1000000).toFixed(1));
  }
  return metasResult;
}

function getSalesPerWeek(userInfo){
  let salesResult = [];
  for (let i = 0; i < userInfo.weekResult.data.length; i++) {
    let weekSaleSum = 0;
    for (let j = 0; j <= i; j++) {
      weekSaleSum+=userInfo.weekResult.data[j].sale;
    }
    salesResult.push((weekSaleSum/1000000).toFixed(1));
  }
  return salesResult;
}

function getSalesPerWeekPastYear(userInfo, weights){
  let salesResult = [];
  let lastYearTotalSale = userInfo.infoResult.data[0].pastYearSale;
  for (let i = 0; i < weights.length; i++) {
    salesResult.push(((lastYearTotalSale*weights[i])/1000000).toFixed(1));
  }
  return salesResult;
}

function getSalesPerWeekPastMonth(userInfo, weights){
  let salesResult = [];
  let lastYearTotalSale = userInfo.infoResult.data[0].pastMonthSale;
  for (let i = 0; i < weights.length; i++) {
    salesResult.push(((lastYearTotalSale*weights[i])/1000000).toFixed(1));
  }
  return salesResult;
}

/*---------------------------- CALCULOS PARA EL GRAFICO RADIAL --------------------------------*/

function getRightDataForRadial(userInfo){
  let advancePercentageMonth = userInfo.infoResult.data[0].monthAdvance;
  let actualSale = userInfo.infoResult.data[0].sale;
  let futurePercentageMonth = 100-advancePercentageMonth;
  let futureSaleInMonth = (futurePercentageMonth*actualSale)/advancePercentageMonth;
  let resultantePercentage = (futureSaleInMonth*100)/userInfo.infoResult.data[0].budget;
  document.getElementById('poyectadoTitleID').innerHTML = '<p>' + newFormat.format(futureSaleInMonth) + '</p>';
  return resultantePercentage;
}