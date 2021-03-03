import express from "express";
import chatbotController from "../controllers/chatbotController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", chatbotController.test)
    router.get("/webhook", chatbotController.getWebHook)
    router.post("/webhook", chatbotController.postWebHook)
    router.get('/demo-webview', chatbotController.getWebView)
    router.get('/results', chatbotController.getResult)
    router.post('/results', chatbotController.postResult)
    return app.use("/", router)
}   

module.exports = initWebRoutes