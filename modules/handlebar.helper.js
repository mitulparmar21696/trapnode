

var helperFunction = {
    section: function (name, options) {
        if (!this._sections)
            this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    // put all of your helpers inside this object
    ifCond: function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
    math: function (lvalue, operator, rvalue, options) {
        console.log(lvalue);
        console.log(rvalue);
        console.log(operator);
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        console.log(lvalue);
        console.log(rvalue);
        console.log(operator);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },
    bar: function () {
        return "BAR";
    },
    looping: function (n, options) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            accum += options.fn(i);
        }
        return accum;
    },
    toJSON: function (obj) {
        return JSON.stringify(obj, null, 3);
    },
    dateFormat: function (date) {

        date = new Date(date);
        var options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        var fd = new Date(date.getTime()).toLocaleDateString('en-US',options);
//        var day = date.getDate();
//        var month = date.getMonth();
//        var year = date.getFullYear();
//
//        if (month < 10) {
//            month = "0" + month;
//        }
//
//        if (day < 10) {
//            day = "0" + day;
//        }
//
//        var finalDate = month + '/' + day + '/' + year;

        return  fd;

    }
};

exports.helperFunction = helperFunction;