/*
  © CoinCalc.Me | v1.2 | https://github.com/jacobbates/CoinCalc.Me
*/

$( document ).ready(function() {

  //URL Parameter Function
  $.urlParam = function(param){
    var results = new RegExp('[\?&]' + param + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  }

  //Fetch URL params
  var coin_name = $.urlParam('c');
  var buy_amount = $.urlParam('a');
  var buy_price = $.urlParam('bp');
  var buy_fees = $.urlParam('bf');
  var sell_price = $.urlParam('sp');
  var sell_fees = $.urlParam('sf');

  if (coin_name){
    $( "#coin_name" ).val(decodeURIComponent(coin_name));
  }
  if ($.isNumeric(buy_amount)){
    $( "#buy_amount" ).val(buy_amount);
  }
  if ($.isNumeric(buy_price)){
    $( "#buy_price" ).val(buy_price);
  }
  if ($.isNumeric(buy_fees)){
    $( "#buy_fees" ).val(buy_fees);
  }
  if ($.isNumeric(sell_price)){
    $( "#sell_price" ).val(sell_price);
  }
  if ($.isNumeric(sell_fees)){
    $( "#sell_fees" ).val(sell_fees);
  }

  //Check URL for auto-fetch
  var fetch_auto = $.urlParam('af');
  var fetch_ticker = decodeURIComponent($.urlParam('t'));
  var fetch_fiat = decodeURIComponent($.urlParam('f'));
  if (fetch_auto == 1 && fetch_ticker.length >= 1 && fetch_ticker.length <= 5){

    //Update fetch fields
    $('#fetch_auto').prop('checked', true);
    $('#fetch_ticker').val(fetch_ticker);

    //Check currency
    var currency = "USD";
    if (fetch_fiat.length = 3){
      currency = fetch_fiat;
      $('#fetch_fiat').val(currency);
    }

    autoFetch(currency,fetch_ticker);
    updateURL();

  }

  //Initial Calc Update
  updateCalc();

  // Initiate btn-copy Tooltip
  $('.btn-copy').tooltip({
    trigger: 'click',
    placement: 'top'
  });
  function setTooltip(btn, message) {
    $(btn).tooltip('hide')
      .attr('data-original-title', message)
      .tooltip('show');
  }
  function hideTooltip(btn) {
    setTimeout(function() {
      $(btn).tooltip('hide');
    }, 1000);
  }

  // Initiate ClipboardJS
  var copy_button = new Clipboard('.btn-copy');
  copy_button.on('success', function(e) {
    setTooltip(e.trigger, 'Copied!');
    hideTooltip(e.trigger);
  });
  copy_button.on('error', function(e) {
    setTooltip(e.trigger, 'Failed!');
    hideTooltip(e.trigger);
  });

  // Initiate fetch_auto checkbox click
  $('#fetch_auto').click(function() {
    updateURL();
  });

  // Initiate fetch_auto update button click
  $('#fetch_update').click(function() {

    if ($('#fetch_auto').prop('checked')) {
    //If auto-fetch enabled
      var fetch_auto = 1;
      var fetch_ticker = $('#fetch_ticker').val();
      var currency = $('#fetch_fiat').val();
      
      autoFetch(currency,fetch_ticker);

    }

  });
  
});

function autoFetch(currency,fetch_ticker) {

  //Fetch from coinmarketcap.com API
  var fetch_price = 0;
  $.get("https://api.coinmarketcap.com/v1/ticker/?convert="+currency, function(data, status) {
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].symbol == fetch_ticker) {
        fetch_name = data[i].name;
        fetch_price = data[i].price_usd;
        
        if(currency=="AUD"){
          fetch_price = data[i].price_aud;
        }else if(currency=="EUR"){
          fetch_price = data[i].price_eur;
        }else if(currency=="CAD"){
          fetch_price = data[i].price_cad;
        }

        //Update name & sell_price
        $("#coin_name").val(fetch_name);
        $("#sell_price").val(parseFloat(fetch_price));
        
        //Recalc
        updateCalc();

      }
    }
  });

}

$("#calc_method").on('change', function(){
  //Determine Input Method Selected for Calculation
  var calc_method = $( "#calc_method" ).val();
  if (calc_method == "Amount+Price"){

    //rebuild buy_amount enabled
    var buy_amount   = $( "#buy_amount" ).val()*1;
    $( "#buy_amount" ).remove();
    $('.buy-amount').append('<input id="buy_amount" class="form-control bg-yellow" type="number" value="'+parseFloat(buy_amount.toFixed(6))+'">');

    //rebuild buy_total disabled
    var buy_total   = $( "#buy_total" ).val()*1;
    $( "#buy_total" ).remove();
    $('.buy-total').append('<input id="buy_total" class="form-control" type="input" value="$'+buy_total.toFixed(2)+'" disabled>');
  
    //rebuild buy_price enabled
    var buy_price   = $( "#buy_price" ).val().replace('$','');
    buy_price = buy_price*1;
    $( "#buy_price" ).remove();
    $('.buy-price').append('<input id="buy_price" class="form-control bg-yellow" type="number" value="'+parseFloat(buy_price.toFixed(6))+'">');

  } else if (calc_method == "Price+Total") {

    //rebuild buy_amount disabled
    var buy_amount   = $( "#buy_amount" ).val()*1;
    $( "#buy_amount" ).remove();
    $('.buy-amount').append('<input id="buy_amount" class="form-control" type="number" value="'+parseFloat(buy_amount.toFixed(6))+'" disabled>');

    //rebuild buy_total enabled
    var buy_total   = $( "#buy_total" ).val().replace('$','');
    buy_total = buy_total*1;
    $( "#buy_total" ).remove();
    $('.buy-total').append('<input id="buy_total" class="form-control bg-yellow" type="number" value="'+buy_total.toFixed(2)+'">');
  
    //rebuild buy_price enabled
    var buy_price   = $( "#buy_price" ).val().replace('$','');
    buy_price = buy_price*1;
    $( "#buy_price" ).remove();
    $('.buy-price').append('<input id="buy_price" class="form-control bg-yellow" type="number" value="'+parseFloat(buy_price.toFixed(6))+'">');

  } else if (calc_method == "Amount+Total") {

    //rebuild buy_amount enabled
    var buy_amount   = $( "#buy_amount" ).val()*1;
    $( "#buy_amount" ).remove();
    $('.buy-amount').append('<input id="buy_amount" class="form-control bg-yellow" type="number" value="'+parseFloat(buy_amount.toFixed(6))+'">');

    //rebuild buy_total enabled
    var buy_total   = $( "#buy_total" ).val().replace('$','');
    buy_total = buy_total*1;
    $( "#buy_total" ).remove();
    $('.buy-total').append('<input id="buy_total" class="form-control bg-yellow" type="number" value="'+buy_total.toFixed(2)+'">');
  
    //rebuild buy_price disabled
    var buy_price   = $( "#buy_price" ).val()*1;
    $( "#buy_price" ).remove();
    $('.buy-price').append('<input id="buy_price" class="form-control" type="input" value="$'+parseFloat(buy_price.toFixed(6))+'" disabled>');
  
  }
});

function updateCalc() {

  //UpdateCalc Function (Primary Calculations)

  var calc_method = $( "#calc_method" ).val();

  var buy_fees    = $( "#buy_fees" ).val()*1;
  var buy_amount, buy_price, buy_value, buy_txcost, buy_total = 0;

  if (calc_method == "Amount+Price"){

    buy_amount  = $( "#buy_amount" ).val()*1;
    buy_price   = $( "#buy_price" ).val()*1;
    buy_value   = buy_amount*buy_price;
    buy_txcost  = buy_value*(buy_fees/100);
    buy_total   = buy_value+buy_txcost;

    $( "#buy_total" ).val('$'+buy_total.toFixed(2));

  } else if (calc_method == "Price+Total") {

    buy_total   = $( "#buy_total" ).val()*1;
    buy_value   = buy_total/(1+(buy_fees/100));
    buy_txcost  = buy_total-buy_value;
    buy_price   = $( "#buy_price" ).val()*1;
    buy_amount  = buy_value/buy_price;

    $( "#buy_amount" ).val(parseFloat(buy_amount.toFixed(6)));

  } else if (calc_method == "Amount+Total") {

    buy_total   = $( "#buy_total" ).val()*1;
    buy_value   = buy_total/(1+(buy_fees/100));
    buy_txcost  = buy_total-buy_value;
    buy_amount  = $( "#buy_amount" ).val()*1;
    buy_price   = buy_value/buy_amount;

    $( "#buy_price" ).val('$'+parseFloat(buy_price.toFixed(6)));

  }

  $( "#buy_value" ).val('$'+buy_value.toFixed(2));
  $( "#buy_txcost" ).val('$'+buy_txcost.toFixed(2));

  var sell_amount  = buy_amount;
  var sell_price   = $( "#sell_price" ).val()*1;
  var sell_value   = sell_amount*sell_price;
  var sell_fees    = $( "#sell_fees" ).val()*1;
  var sell_txcost  = sell_value*(sell_fees/100);
  var sell_total   = sell_value-sell_txcost;
  
  var value_change = ((sell_price-buy_price)/buy_price)*100;
  var balance_change = (sell_total-buy_total)/buy_total;
  var profit_loss  = sell_total-buy_total;
  
  $( "#sell_amount" ).val(parseFloat(sell_amount.toFixed(6)));
  $( "#sell_value" ).val('$'+sell_value.toFixed(2));
  $( "#sell_txcost" ).val('$'+sell_txcost.toFixed(2));
  $( "#sell_total" ).val('$'+sell_total.toFixed(2));
  $( "#value_change" ).val(value_change.toFixed(2)+'%');
  $( "#profit_loss" ).val('$'+profit_loss.toFixed(2));

  updateURL();

}

$('.estimator').on('keyup input change', 'input[type=number], #coin_name', function(){
  //Bind inputs to updateCalc Function
  updateCalc();
});

$('#configModal').on('keyup input change', 'input, select', function(){
  //Bind inputs to autoUpdate Function
  updateURL();
});

function updateURL() {
  //Update URL Function
  var buy_amount  = $( "#buy_amount" ).val()*1;
  var buy_price   = $( "#buy_price" ).val()*1;
  var buy_fees    = $( "#buy_fees" ).val()*1;
  var sell_price  = $( "#sell_price" ).val()*1;
  var sell_fees   = $( "#sell_fees" ).val()*1;
  var coin_name   = encodeURIComponent($( "#coin_name" ).val());

  buy_price = parseFloat(buy_price.toFixed(6)); //limit buy_price decimal in URL to 6
  sell_price = parseFloat(sell_price.toFixed(6)); //limit sell_price decimal in URL to 6
  var save_url = 'https://coincalc.me/?'+'c='+coin_name+'&a='+buy_amount+'&bp='+buy_price+'&bf='+buy_fees+'&sp='+sell_price+'&sf='+sell_fees;
  
  if ($('#fetch_auto').prop('checked')) {
    //If auto-fetch enabled
    var fetch_auto = 1;
    var fetch_ticker = encodeURIComponent($('#fetch_ticker').val());
    var fetch_fiat = encodeURIComponent($('#fetch_fiat').val());
    save_url = save_url+'&af='+fetch_auto+'&t='+fetch_ticker+'&f='+fetch_fiat;
  }

  $( "#save_url" ).val(save_url);
}
