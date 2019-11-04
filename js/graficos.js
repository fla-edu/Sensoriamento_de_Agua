$(document).ready(function(){
  getStatusValvula();
  montaGrafico();
});


function montaGrafico() {

    FusionCharts.ready(function() {
      var myChart = new FusionCharts({
        type: "cylinder",
        renderAt: "chart-container",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource: {
          chart: {
            caption: "Monitoramento do Nível de Água",
            lowerlimit: "0",
            upperlimit: "2",
            lowerlimitdisplay: "Vazio",
            upperlimitdisplay: "Cheio",
            numbersuffix: " ltrs",
            cylfillcolor: "#6eabf0",
            plottooltext: "Monitoramento do Nível de Água</b>",
            cylfillhoveralpha: "85",
            // refreshInterval: "1",
            // refreshInstantly: "1",
            dataStreamUrl: 'http://192.168.0.104:3000/litros',
            theme: "umber",
            "bgalpha": "100",
            "bgColor": "#222428",
            "borderThickness": "0",
            "baseFontColor": "#ffffff",
            "tickValueStep": "0.25",
            "showTickMarks": "1",
            "minorTMColor": "#ffffff",
            "majorTMColor": "#ffffff",
            "majorTMNumber": "9"
          }
          
        }
      }).render();

      var myChart2 = new FusionCharts({
        type: "angulargauge",
        renderAt: "chart-container-2",
        width: "110%",
        height: "100%",
        dataFormat: "json",
        dataSource: {
          chart: {
            caption: "Monitoramento do Nível de Água",
            lowerlimit: "0",
            upperlimit: "1",
            showvalue: "1",
            numbersuffix: "%",
            theme: "umber",
            showtooltip: "0",
            dataStreamUrl: 'http://192.168.0.104:3000/porcentagem',
            "bgalpha": "100",
            "bgColor": "#222428",
            "borderThickness": "0",
            "baseFontColor": "#ffffff",
            "minorTMColor": "#ffffff",
            "majorTMColor": "#ffffff",
          },
          colorrange: {
            color: [
              {
                minvalue: "0",
                maxvalue: "0.50",
                code: "#F2726F"
              },
              {
                minvalue: "0.50",
                maxvalue: "0.60",
                code: "#FFC533"
              },
              {
                minvalue: "0.60",
                maxvalue: "0.80",
                code: "#62B58F"
              },
              {
                  minvalue: "0.80",
                  maxvalue: "0.90",
                  code: "#FFC533"
              },
              {
                minvalue: "0.90",
                maxvalue: "1",
                code: "#F2726F"
              }
            ]
          }        
        }
      }).render();
    });
    
}


function getStatusValvula(){
  $.ajax({
    url: 'http://192.168.0.104:3000/valvula',
    method: 'GET'
  }).done(function(res){
      valor = res;
      alteraValorBotaoValvula(valor);
    })
}

window.setInterval(function(){
    getStatusValvula();
}, 1000);


function setValvula(){

  let valor = $('#btnValvula').val();
  
  $.ajax({
    url: 'http://192.168.0.104:3000/',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      "valor": valor
    }),
    method: 'POST'
  }).done(function(res){
      console.log('Enviou: ' +valor);
  })
}

$(document).on('click', '#btnValvula', function(){

  let valor = $('#btnValvula').val();

  setValvula();
  alteraValorBotaoValvula(valor);

});

function alteraValorBotaoValvula(valor){
  if(valor == 0){
    $('#btnValvula').removeClass('btn-success');
    $('#btnValvula').addClass('btn-danger');
    $('#btnValvula').val('1');
    $('#btnValvula').text('Desligar Válvula');
  }
  if(valor == 1){
    $('#btnValvula').removeClass('btn-danger');
    $('#btnValvula').addClass('btn-success');
    $('#btnValvula').val('0');
    $('#btnValvula').text('Ligar Válvula');
  }
}