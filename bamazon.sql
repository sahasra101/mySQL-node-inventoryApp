DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Presto Dish Heater", "housewares", 59.99, 50), ("black satin pajamas", "clothing", 49.99, 50), ("Fire TV", "electronics", 49.99, 100), ("Alexa speaker hub", "electronics", 99.99, 100), ("General Tires", "auto parts", 124.99, 50), ("Pirelli Tires", "auto parts", 299.99, 24), ("Beats Headphones", "electronics", 99.99, 100), ("Kodiak Brownie Mix", "food", 4.99, 50), ("Smartfood Popcorn case", "food", 14.99, 25), ("Beats Bluetooth Speaker ", "electronics", 99.99, 100), ("iPhone X", "electronics", 999.99, 100), ("Airpods", "electronics", 149.99, 100), ("xenon headlights", "auto parts", 49.99, 30);