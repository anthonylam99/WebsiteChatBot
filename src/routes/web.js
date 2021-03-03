import express from "express";
import chatbotController from "../controllers/chatbotController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", chatbotController.test)
    router.get("/webhook", chatbotController.getWebHook)
    router.post("/webhook", chatbotController.postWebHook)
    router.get('/demo-webview', chatbotController.getWebView)
    router.post('/results', chatbotController.getResult)
    return app.use("/", router)
}   

module.exports = initWebRoutes