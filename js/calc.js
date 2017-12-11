/*
  © CoinCalc.Me | v1.1 | https://github.com/jacobbates/CoinCalc.Me
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
  
});

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
  $( "#sell_price" ).val(parseFloat(sell_price.toFixed(6)));

  updateURL();

}

$('.estimator').on('keyup input change', 'input[type=number], #coin_name', function(){
  //Bind inputs to updateCalc Function
  updateCalc();
});

function updateURL() {
  //Update URL Function
  var buy_amount  = $( "#buy_amount" ).val();
  var buy_price   = $( "#buy_price" ).val();
  var buy_fees    = $( "#buy_fees" ).val();
  var sell_price   = $( "#sell_price" ).val();
  var sell_fees    = $( "#sell_fees" ).val();
  var coin_name    = $( "#coin_name" ).val();
  var save_url = 'https://coincalc.me/?'+'c='+encodeURIComponent(coin_name)+'&a='+buy_amount+'&bp='+buy_price+'&bf='+buy_fees+'&sp='+sell_price+'&sf='+sell_fees;
  $( "#save_url" ).val(save_url);
}
