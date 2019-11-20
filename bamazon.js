require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table3');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    password: process.env.mySQLpswd,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    readProducts();
});

function createProduct() {
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: "Samsung QLED TV 40inch",
            department_name: "electronics",
            price: 250,
            stock_quantity: 100
        },
        function (err, res) {
            if (err) throw err;
        }
    );
    // logs the actual query being run
    console.log(query.sql);
}

function updateProduct() {
    console.log("Updating products...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: 50
            },
            {
                product_name: ""
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " stock_quantity updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            //   deleteSong();
        });

    // logs the actual query being run
    console.log(query.sql);
}

function deleteProduct() {
    console.log("Deleting a product...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        {
            product_name: ""
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product deleted!\n");
            // Call readProducts AFTER the DELETE completes
            //   readSongs();
        });
}

function readProducts() {
    console.log("\nDisplaying all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);

        // connection.end();

        var table = new Table({
            head: ['ID', 'Product Name', 'Department Name', 'Price $', 'Inventory'],
            colWidths: [5, 30, 20, 10, 11]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        for (var j = 0; j < res.length; j++) {
            table.push([res[j].id, res[j].product_name, res[j].department_name, res[j].price, res[j].stock_quantity]);
        }
        console.log(table.toString());
    });
    buyItem();

}

function buyItem() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you show the list of items, prompt the user for which item they'd like to buy
        inquirer
            .prompt([
                {
                    name: "buyByID",
                    type: "input",
                    message: "What is the ID of the item you would like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }])
            .then(function (answer) {
                // get the information of the item to buy
                var itemToBuy = "";
                var itemPrice = 0;
                var quantItemAvail = 0;
                var quantDesired = parseInt(answer.quantity);
                //   match ID to item 
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === parseInt(answer.buyByID)) {
                        itemToBuy = results[i].product_name;
                        itemPrice = parseFloat(results[i].price);
                        quantItemAvail = parseInt(results[i].stock_quantity);
                        console.log("\nConfirmation: you want to buy " + itemToBuy + ". We have " + quantItemAvail + " in stock.")
                    }
                }
                // if (itemToBuy === "") {
                //     console.log("We are sorry, you have selected an invalid item! Please try again!")
                // }
                var newQuant = 0;
                var totalPrice = parseFloat(itemPrice) * parseInt(quantDesired);
                if (quantItemAvail >= quantDesired) {
                    console.log("We have enough of your desired product in stock.");
                    console.log("\nThe price for each item is $" + itemPrice + ".")
                    console.log("\nThe total price for your purchase is: $" + totalPrice);
                    newQuant = quantItemAvail - quantDesired;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuant
                            },
                            {
                                product_name: itemToBuy
                            }
                        ], function (err, res) {
                            if (err) throw err;
                        });
                    askAnotherPurchase();
                    // coding for not enough in stock
                } else if (quantItemAvail < quantDesired) {
                    console.log("We are sorry. We do not have enough of your desired product in stock.");
                    console.log("\nPlease update your quantity based on our inventory or choose a different item.");
                    askAnotherPurchase();
                }
            });
    });
}

function askAnotherPurchase() {
    inquirer
        .prompt(
            {
                name: "anotherPurchase",
                type: "input",
                message: "Would you like to make another purchase? (y or n)"
            })
        .then(function (answer) {
            if (answer.anotherPurchase == "y") {
                readProducts();
            } else if (answer.anotherPurchase == "n") {
                console.log("Thank you for your business! Have a nice day!");
                connection.end();
            }
        });
}

function updateQuant() {
    console.log("Updating products...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: 50
            },
            {
                product_name: ""
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " stock_quantity updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            //   deleteSong();
        });

    // logs the actual query being run
    console.log(query.sql);
}


// function which prompts the user for what action they should take
function startbidding() {
    inquirer
        .prompt[{
            name: "buyByID",
            type: "input",
            message: "What is the ID of the item you would like to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }]
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.bidByID === "POST") {
                postAuction();
            }
            else if (answer.postOrBid === "BID") {
                bidAuction();
            } else {
                connection.end();
            }
        });
}
