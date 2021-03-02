import express from "express";


let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", './src/views')
    app.use(express.static(__dirname + '/public'));
}

module.exports = configViewEngine