import express from "express";
import chatbotController from "../controllers/chatbotController"
import bodyParser from "body-parser";

let router = express.Router();


let initWebRoutes = (app) => {
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get("/", chatbotController.test)
    router.get("/webhook", chatbotController.getWebHook)
    router.post("/webhook", chatbotController.postWebHook)
    router.get('/demo-webview', chatbotController.getWebView)
    router.post('/results', chatbotController.postResult)
    router.get('/setup',chatbotController.setupGetStartedButton)
    
    return app.use("/", router)
}

module.exports = initWebRoutes