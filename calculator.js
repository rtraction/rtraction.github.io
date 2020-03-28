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
    'multiplier': 0.0275, // Companies spend an average of 2.75% (2.5-3%) of their unfunded budget on their website
    'parseInt': function(value) {
        return parseInt(value, 10) || 0;
    },
    'roundNext500': function(number) {
        return Math.ceil((this.parseInt(number) + 1) / 500) * 500;
    },
    'formatNumber': function(n) {
        // format number 1234567 to 1,234,567
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    'operatingBudget': function() {
        var operating_budget = this.parseInt(document.getElementsByName(this.budget_field_name)[0].value);
        // console.log('operating_budget:' + operating_budget);
        return operating_budget;
    },
    'funding': function() {
        var funded_budget = this.parseInt(document.getElementsByName(this.funding_field_name)[0].value) / 100 * this.operatingBudget();
        // console.log('funded: ' + funded_budget);
        return funded_budget;
    },
    'unfunded': function() {
        var unfunded = this.operatingBudget() - this.funding();
        // console.log('unfunded: ' + unfunded);
        return unfunded;
    },
    'lowRange': function() {
        var low_range = this.parseInt(this.roundNext500(this.low_multiplier * this.unfunded()));
        // console.log('low_range: ' + low_range);
        return low_range
    },
    'highRange': function() {
        var high_range = this.parseInt(this.roundNext500(this.high_multiplier * this.unfunded()));
        // console.log('high_range: ' + high_range);
        return high_range;
    },
    'monthly': function() {
        var monthly = this.parseInt(this.roundNext500(this.multiplier * this.unfunded())) / 36; //36: THE MAGIC PACKAGE NUMBER (36 months)

        for (var i in this.packages) {
            if (monthly <= i) {
                break;
            }
        }

        return i;
    },
    'readableResults': function() {

        var low = this.lowRange();
        var high = this.highRange();

        var range = "approximately <strong>$" + this.formatNumber(low) + " - $" + this.formatNumber(high) + " every 3-5 years</strong>";

        if(high <= 10000) {
            range = "<strong>less than $10,000 every 3-5 years</strong>";
        } else if (high >= 125000) {
            range = "<strong>more than $125,000 every 3-5 years</strong>";
        }

        var plan = "<strong>" + this.packages[this.monthly()] + "</strong>";

        //calculator results
        return "Results:<br />&nbsp;<br />Based on our market research and data, your website budget would be "
            + range + " based on a traditional billing structure.<br />&nbsp;<br />Using our equalized package pricing,"
            + " we would recommend: <br />" + plan;//\n\nSupport: up to $170/month";
    },
    'showResults': function() {

        var results = this.readableResults();

        //human readable results
        document.getElementById("calculation_results").innerHTML = results;
        document.getElementsByName("TICKET.content")[0].value = results.replace("<strong>", "").replace("</strong>", "").replace("<br />", "\n");

        setTimeout(function() {
            // if (document.getElementsByClassName('submitted-message').length) {
                gtag('event', 'calculate', {'event_category': 'calculator'});
                gtag_report_conversion();
                gtag('event', 'proposal-request', {'event_category': 'calculator'});

                //show the results
                document.getElementsByTagName("BODY")[0].classList.add("show-results");
            // }
        }, 1000);

    },
    'init': function(){
        setTimeout(function() {
            document.getElementsByName(this.budget_field_name)[0].style.width = "200px";
            document.getElementsByName(this.funding_field_name)[0].style.width = "200px";

            var theform = document.getElementsByTagName('form')[0];
            theform.addEventListener("submit", function() { this.submit() });
        }.bind(this), 2000); //timeout
    },
    'submit': function(){
        if (document.getElementsByName(this.budget_field_name)[0]) {
            this.showResults();
        }
    }
};
calculation.init();


function gtag_report_conversion(url) {
    var callback = function() {
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
