// Recebe o último valor da válvula, e monta os 2 gráficos ao iniciar a página
$(document).ready(function(){
  getStatusValvula();
  getStatusPorcentagem()
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
            refreshInterval: "1",
            refreshInstantly: "1",
            dataStreamUrl: 'http://157.245.85.94:3000/litros',
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
            upperlimit: "100",
            showvalue: "1",
            numbersuffix: "%",
            theme: "umber",
            showtooltip: "0",
            refreshInterval: "1",
            refreshInstantly: "1",
            dataStreamUrl: 'http://157.245.85.94:3000/porcentagem',
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
                maxvalue: "40",
                code: "#F2726F"
              },
              {
                minvalue: "40",
                maxvalue: "50",
                code: "#FFC533"
              },
              {
                minvalue: "50",
                maxvalue: "70",
                code: "#62B58F"
              },
              {
                  minvalue: "70",
                  maxvalue: "80",
                  code: "#FFC533"
              },
              {
                minvalue: "80",
                maxvalue: "100",
                code: "#F2726F"
              }
            ]
          }        
        }
      }).render();
    });
    
}

// AJAX que requisita o ultimo valor da valvula
function getStatusValvula(){
  $.ajax({
    url: 'http://157.245.85.94:3000/valvula',
    method: 'GET'
  }).done(function(res){
      valor = res;
      alteraValorBotaoValvula(valor);
    })
}

function getStatusPorcentagem(){
  $.ajax({
    url: 'http://157.245.85.94:3000/porcentagem',
    method: 'GET'
  }).done(function(res){
      let valor = res;
      valor = valor.split('=');
      valor = parseFloat(valor[1]).toFixed(2);
      console.log(valor);
      if(valor <= 40){
        alertify.error(`Nível abaixo do mínimo de segurança: ${(valor)}%. Verifique imediatamente.`); 
      } else if(valor >= 80){
        alertify.error(`Nível acima do máximo de segurança: ${(valor)}%. Verifique imediatamente.`); 
      }
    })
}
// A cada 1 segundo, verifica o status da valvula 
window.setInterval(function(){
    getStatusValvula();
    getStatusPorcentagem()
}, 5000);


// Caso o botao de Ligar/Desligar valvula seja clicado
// Ele envia esse valor para o MongoDB e transmite ao sensor
function setValvula(){

  let valor = $('#btnValvula').val();
  
  $.ajax({
    url: 'http://157.245.85.94:3000/',
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

// Caso o valor da valvula seja alterado, ele muda a cor e o valor do Botao
function alteraValorBotaoValvula(valor){
  
  if(valor == 1){
    $('#btnValvula').removeClass('btn-success');
    $('#btnValvula').addClass('btn-danger');
    $('#btnValvula').val('0');
    $('#btnValvula').text('Desligar Válvula');
    
  }
  if(valor == 0){
    $('#btnValvula').removeClass('btn-danger');
    $('#btnValvula').addClass('btn-success');
    $('#btnValvula').val('1');
    $('#btnValvula').text('Ligar Válvula');
  }
}