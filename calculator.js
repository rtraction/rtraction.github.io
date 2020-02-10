
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-776541647/qsM4CLW60rsBEM-rpPIC',
      'event_callback': callback
  });
  return false;
}


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

setTimeout(function() {
  //field names
  var budget_field_name = "operating_budget"; // <input name="budget" ...
  var funding_field_name = "government_spending_percent";

  document.getElementsByName(budget_field_name)[0].style.width = "200px";
  document.getElementsByName(funding_field_name)[0].style.width = "200px";

  //hide the Get In Touch part
  var fieldsets = document.getElementsByClassName('field');
  var getintouch = document.getElementById('get-in-touch');
  addclasses = false;
  for (var i = 0; fieldsets[i]; i++) {
    if(fieldsets[i].contains(getintouch)) {
      addclasses = true;
    }
    if(addclasses) {
      fieldsets[i].classList.add("getintouch");
    }
  }
  document.getElementsByClassName("hs_submit")[0].classList.add("getintouch");
  document.getElementsByClassName("legal-consent-container")[0].classList.add("getintouch");
  

  var theform = document.getElementsByTagName('form')[0];
  theform.addEventListener("submit", function() {
      gtag_report_conversion();
      gtag('event', 'proposal-request', {'event_category': 'calculator'});
  });

  var calculation_results = "<div class='sqs-block-html'><blockquote id='calculation_results'></blockquote></div>";
  var calculate_button = "<input type='button' value='CALCULATE' id='calculate_button' class='hs-button primary large'>";
  document.getElementsByName("TICKET.content")[0].outerHTML = calculate_button + calculation_results + document.getElementsByName("TICKET.content")[0].outerHTML;

  document.getElementById("calculate_button").addEventListener("click", function(){

    gtag('event', 'calculate', {'event_category' : 'calculator' });

    //show the get in touch part of the form
    getintouchfieldsets = document.getElementsByClassName('getintouch');
    for(var i in getintouchfieldsets) {
      getintouchfieldsets[i].style="display: block";
    }

    document.getElementsByClassName('getintouch').style="display: block";
    document.getElementsByClassName('hs-TICKET\.hs_pipeline_stage').style="display: none";
    document.getElementsByClassName('hs-TICKET\.hs_pipeline').style="display: none";
    
    if(document.getElementsByName(budget_field_name)[0]) {
      //get the field values
      var budget = parseInt(document.getElementsByName(budget_field_name)[0].value);
      var funding = (parseInt(document.getElementsByName(funding_field_name)[0].value)/100)*budget;
      if(isNaN(funding)) { funding = 0; }



      //unfunded operational budget
      var unfunded = budget - funding;//( 2*funding < budget ) ? (budget - funding) : budget;

      if(unfunded > 0) {

        //complexity factor that we'll add to the high/low calculation
        var complexity = 1;

        var low = (((1.5+complexity)/100) * unfunded).toFixed(2);
        low = Math.ceil((parseInt(low)+1) / 500) * 500;
        var high = (((2+complexity)/100) * unfunded).toFixed(2);
        high = Math.ceil((parseInt(high)+1) / 500) * 500;

        var z = parseInt(low + high)/72; //average (/2), divided by 36, THE MAGIC PACKAGE NUMBER

        var packages = {
          800: "Bronze Package (Starting at $565 / month)",
          1400: "Silver Package (Starting at $875 / month)",
          3200: "Gold Package (Starting at $1,400 / month)",
          3201: "Platinum Package (Contact us for pricing)"
        };
        for (var i in packages) {
          if(z <= i) {
            break;
          }
        }
        var package = packages[i];
        if(i == 1401) {
          i = (Math.ceil((parseInt(z)+1) / 10) * 10);
        }
        i = parseInt(i).toFixed(2);

        var range = "approximately <strong>$" + formatNumber(low) + " - $" + formatNumber(high) + " every 3-5 years</strong>";
        var plan = "<strong>"+package+"</strong>";

        if(high < 10000) {
          range = "<strong>less than $10,000 every 3-5 years</strong>";
        }
        if(high > 200000) {
          range = "<strong>more than $200,000 every 3-5 years</strong>";
        }

        //calculator results
     document.getElementsByName("calculator_recommended_price")[0].value = i;
        document.getElementById("calculation_results").innerHTML = "Results:<br />&nbsp;<br />Based on our market research and data, your website budget would be "+range+" based on a traditional billing structure.<br />&nbsp;<br />Using our equalized package pricing, we would recommend: <br />"+plan;//\n\nSupport: up to $170/month";
        document.getElementsByName("TICKET.content")[0].value = document.getElementById("calculation_results").innerHTML.replace("<strong>", "").replace("</strong>", "").replace("<br />", "\n");
      } else {
        //unfunded <= 0
        document.getElementById("calculation_results").innerHTML = "";
        document.getElementsByName("TICKET.content")[0].value = "";
      }
    }
  }); //event
}, 1000); //timeout
