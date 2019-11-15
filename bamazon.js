require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");

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
        console.log(res);
        connection.end();
    });
}
