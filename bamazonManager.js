
exports.manager = function (inq, mysql, pmpt, Table, connection) {
    var q3 = [
        {
            type: 'list',
            name: 'manageOption',
            message: 'Select one of the following options:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ];

    var q4 = [
        {
            type: 'input',
            name: 'idToAddMore',
            message: 'What is the ID of the product you would like to add inventory it?'
        },
        {
            type: 'input',
            name: 'numOfUnits',
            message: 'How many units would you like to add?'
        }
    ];

    var q5 = [
        {
            type: 'input',
            name: 'newPName',
            message: 'Product Name:'
        },
        {
            type: 'input',
            name: 'newDName',
            message: 'Department Name:'
        },
        {
            type: 'input',
            name: 'newPPrice',
            message: 'Price of Item:'
        },
        {
            type: 'input',
            name: 'newPstock',
            message: 'Number of Units in Stock:'
        }
    ]


    function listMOptions() {
        pmpt(q3).then(function (r, e) {
            if (e) throw e;

            managerOptions(r.manageOption)

        });
    }


    function managerOptions(mOption) {
        switch (mOption) {
            case 'View Products for Sale':
                listAllInventory();
                break;
            case 'View Low Inventory':
                listLowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
        }
    }

    function listAllInventory() {
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
                ['ID:', 'Product:', 'Price:', 'Quantity:']
            );
            for (var key in results) {

                table.push(
                    [results[key].item_id, results[key].product_name, "$" + results[key].price, results[key].stock_quantity]
                );



            }
            console.log(table.toString());
            listMOptions();
        })
    }


    function listLowInventory() {
        var table = new Table({
            chars: {
                'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                , 'right': '║', 'right-mid': '╢', 'middle': '│'
            }
        });

        connection.query('SELECT * FROM products WHERE stock_quantity < 5;', function (error, results, fields) {
            if (error) throw error;

            table.push(
                ['ID:', 'Product:', 'Price:', 'Quantity:']
            );
            for (var key in results) {

                table.push(
                    [results[key].item_id, results[key].product_name, "$" + results[key].price, results[key].stock_quantity]
                );



            }
            console.log(table.toString());
            listMOptions();

        });

    }

    function addInventory() {
        pmpt(q4).then(function (r, e) {
            if (e) throw e;
            var numUnits = parseInt(r.numOfUnits);
            var idNum = r.idToAddMore;
            connection.query('SELECT stock_quantity FROM products WHERE item_id=' + r.idToAddMore, function (error, results, fields) {
                if (error) throw error;
                var totStock = numUnits + results[0].stock_quantity;
                connection.query('UPDATE products SET stock_quantity=' + totStock + ' WHERE item_id=' + idNum, function (error, results, fields) {
                    if (error) throw error;
                })
            });

            listMOptions();
        });
    }

    function addNewProduct() {
        pmpt(q5).then(function (r, e) {
            if (e) throw e;

            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + r.newPName + "' , '" + r.newDName + "', '" + parseInt(r.newPPrice) + "', '" + parseInt(r.newPstock) + "')", function (error, results, fields) {
                if (error) throw error;
                console.log('Your product have been added.');
                listMOptions();
            })

        });
    };

    listMOptions();

};







