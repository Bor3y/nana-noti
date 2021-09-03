import { EventContext, Receiver, ReceiverEvents } from "rhea-promise";
import logger from "../utils/logger";
import connection from "../lib/amqp/connection";
import { receiver } from "../lib/amqp/receiver";
import { NotificationHandleFunc } from "../lib/notification/handler";

const port = parseInt(process.env.AMQP_PORT || "5672");
const host = process.env.AMQP_HOST;
type WorkerOptions = {
  retryCount: number
}

const defaultOptions = {
  retryCount: 3
};

export class RateLimitError extends Error {
  waitingMilliseconds: number;
  constructor(message: string, waitingMilliseconds: number){
    super(message);
    this.name = "RateLimitError";
    this.waitingMilliseconds = waitingMilliseconds;
  }
}

const _handle = async (queueName: string, handle: NotificationHandleFunc, options: WorkerOptions, context: EventContext) => {
  logger.info(`[queue: ${queueName}] Received message: ${JSON.stringify(context.message)}`);
  try {
    await handle(context.message.body);
    context.delivery.accept(); 
  } catch (err) {
    if(err instanceof RateLimitError) {
      logger.info(`[queue: ${queueName}] close worker and reopen it after ${err.waitingMilliseconds} Milliseconds`);
      context.connection.close();
      setTimeout(() => worker(queueName, handle, options), err.waitingMilliseconds);
    }else {
      logger.error(`[queue: ${queueName}] error while handling message: ${JSON.stringify(context.message)}`, err);
      (context.message.delivery_count > options.retryCount) ? 
        context.delivery.reject({ description: err.message}) : context.delivery.release({ delivery_failed: true});
    }
  }
};
export const worker = (queueName: string, handle: NotificationHandleFunc, options: WorkerOptions = defaultOptions) : void => {
  connection(host, port).then((connection) => {
    receiver(connection, queueName, queueName).then((r: Receiver) => {
      r.on(ReceiverEvents.message, async (context: EventContext) => {
        await _handle(queueName, handle, options, context);
      });
      r.on(ReceiverEvents.receiverError, (context) => {
        const receiverError = context.receiver && context.receiver.error;
        if (receiverError) {
          logger.error(`[${connection.id}] An error occurred for receiver sms: `, receiverError);
        }
      });
    });
  });
};
