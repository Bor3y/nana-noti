import express from "express";
import bodyParser from "body-parser";
import { Connection } from "rhea-promise";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import * as notificationController from "./controllers/notification";
import * as healthController from "./controllers/health";
import { boomifyErrorsMiddleware, errorHandlerMiddleware } from "./middlewares/error";
import { asyncMiddleware } from "./middlewares/async";
import type { SendFunction } from "./lib/amqp/sender";

// Create Express server
const app = express();

const container : {
  amqpConnection: Connection,
  sendSms: SendFunction,
  sendEmail: SendFunction,
  sendPush: SendFunction
} = { amqpConnection: new Connection(), sendSms: Object(), sendEmail: Object(), sendPush: Object() };

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", asyncMiddleware(healthController.health));
app.post("/api/sms", asyncMiddleware(notificationController.sms));

if (process.env.NODE_ENV === "development") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Notification Service",
        version: "1",
      },
      servers: [
        {
          url: "http://localhost:3000"
        }
      ]
    },
    apis: ["./src/controllers/*.ts"]
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(boomifyErrorsMiddleware);
app.use(errorHandlerMiddleware);

export { app, container };
