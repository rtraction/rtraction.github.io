var rtr_packages = {
    800: "Bronze Package (Starting at $565 / month)",
    1400: "Silver Package (Starting at $875 / month)",
    3200: "Gold Package (Starting at $1,400 / month)",
    3201: "Platinum Package (Contact us for pricing)"
};

rtrParseInt = function(value) {
    return parseInt(value, 10) || 0;
};

//field names
var budget_field_name = "operating_budget"; // <input name="budget" ...
var funding_field_name = "government_spending_percent";

var rtr_low_multiplier = 0.025; // 2.5%
var rtr_high_multiplier = 0.03; // 3%
var rtr_multiplier = 0.0275; //middle of the budget range we display

function gtag_report_conversion(url) {
    var callback = function () {
        if (typeof(url) !== 'undefined') {
            window.location = url;
        }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-776541647/qsM4CLW60rsBEM-rpPIC',
        'event_callback': callback
    });
    return false;
}

function roundNext500(number) {
    return Math.ceil((rtrParseInt(number) + 1) / 500) * 500;
}

function formatNumber(n) {
    // format number 1234567 to 1,234,567
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

setTimeout(function () {


    document.getElementsByName(budget_field_name)[0].style.width = "200px";
    document.getElementsByName(funding_field_name)[0].style.width = "200px";

    var theform = document.getElementsByTagName('form')[0];
    theform.addEventListener("submit", function () {

        var price = calculate();
        var results = packageText(price);

        //human readable results
        document.getElementById("calculation_results").innerHTML = results;
        document.getElementsByName("TICKET.content")[0].value = results.replace("<strong>", "").replace("</strong>", "").replace("<br />", "\n");


        setTimeout(function() {
            if (document.getElementsByClassName('submitted-message').length) {
                gtag('event', 'calculate', {'event_category': 'calculator'});
                gtag_report_conversion();
                gtag('event', 'proposal-request', {'event_category': 'calculator'});

                //show the results
                document.getElementsByTagName("BODY")[0].classList.add("show-results");
            }
        }, 500);
    });
}, 1000); //timeout

function calculate() {

    if (document.getElementsByName(budget_field_name)[0]) {
        //get the field values
        var budget = rtrParseInt(document.getElementsByName(budget_field_name)[0].value) || 0;
        var funded = ((rtrParseInt(document.getElementsByName(funding_field_name)[0].value) || 0) / 100) * budget;

        console.log('budget:' + budget);
        console.log('funded:' + funded);

        //unfunded operational budget
        if (budget <= funded) {
            return 0;
        }

        var unfunded = budget - funded;
        console.log('unfunded:' + unfunded);

        var monthly = rtrParseInt(roundNext500(rtr_multiplier * unfunded)) / 36; //36: THE MAGIC PACKAGE NUMBER (36 months)

        for (var i in rtr_packages) {
            if (monthly <= i) {
                break;
            }
        }

        if (i === 1401) {
            i = (Math.ceil((rtrParseInt(monthly) + 1) / 10) * 10);
        }

        return i;

    }
}

function packageText(monthly) {

    var total_budget = monthly * 36; // magic package number from before

    var low = roundNext500(rtr_low_multiplier * total_budget);
    var high = roundNext500(rtr_high_multiplier * total_budget);

    var rtr_package = rtr_packages[monthly];

    var range = "approximately <strong>$" + formatNumber(low) + " - $" + formatNumber(high) + " every 3-5 years</strong>";
    var plan = "<strong>" + rtr_package + "</strong>";

    if (high < 10000) {
        range = "<strong>less than $10,000 every 3-5 years</strong>";
    }
    if (high > 200000) {
        range = "<strong>more than $200,000 every 3-5 years</strong>";
    }

    //calculator results
    return "Results:<br />&nbsp;<br />Based on our market research and data, your website budget would be " + range + " based on a traditional billing structure.<br />&nbsp;<br />Using our equalized package pricing, we would recommend: <br />" + plan;//\n\nSupport: up to $170/month";
}

