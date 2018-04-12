//Customer view
var inq = require('inquirer');
var mysql = require('mysql');
var pmpt = inq.createPromptModule();


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});


var qs1 = [
    {
        type: "list",
        name: "viewType",
        message: "Choose from the following views:",
        choices: ["Customer View", "Manager View"]
    }
];

var qs2 = [
    {
        type: "input",
        name: "idNum",
        message: "What is the ID of the product you would like to buy?"
    },
    {
        type: "input",
        name: "numOfUnits",
        message: "How many units of the product you would like to buy?"
    },
];


pmpt(qs1).then(function (r, e) {
    if (e) throw e;

    console.log(r);

    switch (r.viewType) {
        case "Customer View":
            printAllItems();

            break;
        case "Manager View":
            break;
        default:
            console.log("I'm sorry, we could not recognize your response.");
    };
})


function startConnect() {
    connection.connect();
}

function endConnect() {
    connection.end();
}

function printAllItems() {

    startConnect();

    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;

        for (var key in results) {
            console.log(results[key].item_id + " | " + results[key].product_name + " | " + results[key].price)
        }

        pmpt(qs2).then(function (r, e) {
            if (e) throw e;

            var q = `SELECT * FROM products WHERE item_id = ?`;

            var value = [r.idNum];

            connection.query(q, value, function (error, results, fields) {
                if (error) throw error;

                var temp = results[0].stock_quantity - r.numOfUnits;

                if (temp >= 0) {

                    console.log("Your total is $" + r.numOfUnits * results[0].price + ".00");

                    connection.query('UPDATE products SET stock_quantity=' + temp + ' WHERE item_id =' + r.idNum + ';', function (error, results, fields) {
                        if (error) throw error;
                    })
                }
                else {
                    console.log("Insufficient quantity!");
                }
                endConnect();
            })

        })

    });



};


