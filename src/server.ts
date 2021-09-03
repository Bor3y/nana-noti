import { app, container } from "./app";
import logger from "./utils/logger";
import createConnection from "./lib/amqp/connection";
import sender from "./lib/amqp/sender";

const port = parseInt(process.env.AMQP_PORT || "5672");
const host = process.env.AMQP_HOST;

const smsConnectionPoolSize = parseInt(process.env.SMS_CONNECTION_POOL_SIZE || "2");
const emailConnectionPoolSize = parseInt(process.env.Email_CONNECTION_POOL_SIZE || "3");
const pushConnectionPoolSize = parseInt(process.env.PUSH_CONNECTION_POOL_SIZE || "3");

const bootStrapping = async () => {
  container.amqpConnection = await createConnection(host, port);
  container.sendSms = await sender(container.amqpConnection, smsConnectionPoolSize, "SMS");
  container.sendEmail = await sender(container.amqpConnection, emailConnectionPoolSize, "EMAIL");
  container.sendPush = await sender(container.amqpConnection, pushConnectionPoolSize, "PUSH");
};

/**
 * Start Express server.
 */
const server = bootStrapping()
  .then(() => {
    app.listen(app.get("port"), () => {
      logger.info(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
      logger.info("  Press CTRL-C to stop\n");
    });
  })
  .catch(err => {
    logger.error("app crash on bootStrapping with error: ", err);
  });

export default server;
