var inq = require('inquirer');
var mysql = require('mysql');
var pmpt = inq.createPromptModule();
var Table = require('cli-table');
var bamazonManager = require('./bamazonManager.js');


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

function candmPrompt() {
    pmpt(qs1).then(function (r, e) {
        if (e) throw e;


        switch (r.viewType) {
            case "Customer View":
                customerView();

                break;
            case "Manager View":
                bamazonManager.manager(inq, mysql, pmpt, Table, connection);
                break;
        };
    })
}



function customerView() {
    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });


    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;

        table.push(
            ['ID:', 'Product:', 'Price:']
        );
        for (var key in results) {

            table.push(
                [results[key].item_id, results[key].product_name, "$" + results[key].price]
            );



        }
        console.log(table.toString());

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
                candmPrompt();
            })

        })

    });



};

candmPrompt();


