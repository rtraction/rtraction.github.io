var calculation = {
    'budget_field_name':'operating_budget', // <input name="budget" ...
    'funding_field_name': 'government_spending_percent',
    'packages': {
        800: "Bronze Package (Starting at $565 / month)",
        1400: "Silver Package (Starting at $875 / month)",
        3200: "Gold Package (Starting at $1,400 / month)",
        3201: "Platinum Package (Contact us for pricing)"
    },
    'low_multiplier': 0.025,//32.7, // Roughly 2.5% of their operating budget if multiplied by their monthly
    'high_multiplier': 0.03,//39.3, // Roughly 3% of their operating budget if multiplied by their monthly
    'multiplier': 0.0275 // Companies spend an average of 2.75% (2.5-3%) of their unfunded budget on their website
};


calculation.parseInt = function(value) {
    return parseInt(value, 10) || 0;
};

calculation.roundNext500 = function (number) {
    return Math.ceil((calculation.parseInt(number) + 1) / 500) * 500;
};

calculation.formatNumber = function (n) {
    // format number 1234567 to 1,234,567
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

calculation.operatingBudget = function() {
    var operating_budget = calculation.parseInt(document.getElementsByName(calculation.budget_field_name)[0].value);
    console.log('operating_budget:' + operating_budget);
    return operating_budget;
};

calculation.funding = function() {
    var funded_budget = (calculation.parseInt(document.getElementsByName(calculation.funding_field_name)[0].value) / 100) * calculation.operatingBudget()
    console.log('funded: ' + funded_budget);
    return funded_budget;
};

calculation.unfunded = function () {
    var unfunded = calculation.operatingBudget() - calculation.funding();
    console.log('unfunded: ' + unfunded);
    return unfunded;
};

calculation.lowRange = function() {
    var low_range = calculation.parseInt(calculation.roundNext500(calculation.low_multiplier * calculation.unfunded()))
    console.log('low_range: ' + low_range);
    return low_range
};

calculation.highRange = function() {
    var high_range = calculation.parseInt(calculation.roundNext500(calculation.high_multiplier * calculation.unfunded()))
    console.log('high_range: ' + high_range);
    return high_range;
};

calculation.monthly = function() {
    var monthly = calculation.parseInt(calculation.roundNext500(calculation.multiplier * calculation.unfunded())) / 36; //36: THE MAGIC PACKAGE NUMBER (36 months)

    for (var i in calculation.packages) {
        if (monthly <= i) {
            break;
        }
    }

    return i;
};

calculation.readableResults = function() {

    var low = calculation.lowRange();
    var high = calculation.highRange();

    var range = "approximately <strong>$" + calculation.formatNumber(low) + " - $" + calculation.formatNumber(high) + " every 3-5 years</strong>";

    if(high <= 10000) {
        range = "<strong>less than $10,000 every 3-5 years</strong>";
    } else if (high >= 125000) {
        range = "<strong>more than $125,000 every 3-5 years</strong>";
    }

    var plan = "<strong>" + calculation.packages[calculation.monthly()] + "</strong>";

    //calculator results
    return "Results:<br />&nbsp;<br />Based on our market research and data, your website budget would be "
        + range + " based on a traditional billing structure.<br />&nbsp;<br />Using our equalized package pricing,"
        + " we would recommend: <br />" + plan;//\n\nSupport: up to $170/month";
};

calculation.showResults = function() {

    var results = calculation.readableResults();

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

};

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



setTimeout(function () {

    document.getElementsByName(calculation.budget_field_name)[0].style.width = "200px";
    document.getElementsByName(calculation.funding_field_name)[0].style.width = "200px";

    var theform = document.getElementsByTagName('form')[0];
    theform.addEventListener("submit", function () {
        if (document.getElementsByName(calculation.budget_field_name)[0]) {
            calculation.showResults();
        }
    });
}, 1000); //timeout


