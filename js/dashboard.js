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
      console.log(jsonData);
    });
  }
*/


function showData (){
    let idGuardadoEnLocal = localStorage.getItem("idUser");
    let dataUser = jsonData[idGuardadoEnLocal];
    //let dataUser = jsonData[0];
    
    displayVendorName(dataUser.infoResult.data[0].slpName);
    displayBarGraphic(dataUser);
    displayRadialGraphicCumplimiento(dataUser);
    displayRadialGraphicProyectado(dataUser);
    displayPedidosAndCotizaciones(dataUser);
    displayAcumuladoAnual(dataUser);
    displayVentasVSDevoluciones(dataUser);
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
      show : true,
      labels: {
        formatter: function(value){
          return formatMillions(value);
        }
      }
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
      shared: true,
      intersect: false,
      y: {
        formatter : function(value){
          return newFormat.format(value);
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
  let percentageNum = userInfo.infoResult.data[0].budget===0?0:((userInfo.infoResult.data[0].sale / userInfo.infoResult.data[0].budget)*100).toFixed(2);
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
  let data = getRightDataForRadial(userInfo);
  var options = {
    series: [data[0].toFixed(2)],
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
    labels: [newFormat.format(data[1])],
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

/*--------------------------------------- DISPLAY ACUMULADO ANUAL ---------------------------------------*/
function displayAcumuladoAnual(userInfo){
  let yearSale = userInfo.infoResult.data[0].yearSale;
  let yearMeta = userInfo.infoResult.data[0].yearBudget;
  let percentageYear = yearMeta===0?0:((yearSale*100)/yearMeta).toFixed(2);
  let strHTMLVenta = '<p>'+ newFormat.format(yearSale) + '</p>';
  let strHTMLMeta = '<p>'+ newFormat.format(yearMeta) + '</p>';
  let strHTMLPercentage = '<p>'+ percentageYear + '%</p>';
  document.getElementById('ventaAnualID').innerHTML=strHTMLVenta;
  document.getElementById('metaAnualID').innerHTML=strHTMLMeta;
  document.getElementById('percentageAnualID').innerHTML=strHTMLPercentage;

}

/*--------------------------------------- DISPLAY VENTAS VS DEVOLUCIONES ---------------------------------------*/
function displayVentasVSDevoluciones(userInfo){
  let facturado = userInfo.infoResult.data[0].invoices;
  let devoluciones = userInfo.infoResult.data[0].creditNotes;
  let porcentaje = ((devoluciones/facturado*100)).toFixed(2);
  let strHTMLFacturado = '<h6>Facturación</h6> <p>'+ newFormat.format(facturado) + '</p>';
  let strHTMLDevoluciones = '<p>'+ newFormat.format(devoluciones) + '</p>';
  let strHTMLDevolucionesPercentage = porcentaje>0?'<p>%'+ porcentaje + '</p>':'<p>-%'+ -porcentaje + '</p>';
  document.getElementById('facturacionBodyID').innerHTML=strHTMLFacturado;
  document.getElementById('devolucionesID').innerHTML=strHTMLDevoluciones;
  document.getElementById('devolucionesPorcentajeID').innerHTML=strHTMLDevolucionesPercentage;
}

/*--------------------------------------- DISPLAY VENDOR NAME ---------------------------------------*/
function displayVendorName(vendorName){
  vendorName=vendorName.toLowerCase();
  strHTML='<p>'+ vendorName +'</p> <i class="fas fa-user"></i>';
  document.getElementById('vendorName').innerHTML=strHTML;
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
    metasResult.push(userInfo.infoResult.data[0].budget*weights[i]);
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
    salesResult.push(weekSaleSum);
  }
  return salesResult;
}

function getSalesPerWeekPastYear(userInfo, weights){
  let salesResult = [];
  let lastYearTotalSale = userInfo.infoResult.data[0].pastYearSale;
  for (let i = 0; i < weights.length; i++) {
    salesResult.push(lastYearTotalSale*weights[i]);
  }
  return salesResult;
}

function getSalesPerWeekPastMonth(userInfo, weights){
  let salesResult = [];
  let lastYearTotalSale = userInfo.infoResult.data[0].pastMonthSale;
  for (let i = 0; i < weights.length; i++) {
    salesResult.push(lastYearTotalSale*weights[i]);
  }
  return salesResult;
}

function formatMillions(num){
  return ((num / 1000000).toFixed(0) + "M");
}

/*---------------------------- CALCULOS PARA EL GRAFICO RADIAL --------------------------------*/

function getRightDataForRadial(userInfo){
  let advancePercentageMonth = userInfo.infoResult.data[0].monthAdvance;
  let actualSale = userInfo.infoResult.data[0].sale;
  let futurePercentageMonth = 100-advancePercentageMonth;
  let futureSaleInMonth = (futurePercentageMonth*actualSale)/advancePercentageMonth;
  let resultantePercentage = userInfo.infoResult.data[0].budget===0?0:((futureSaleInMonth+actualSale)*100)/userInfo.infoResult.data[0].budget;
  return [resultantePercentage, (futureSaleInMonth+actualSale)];
}