import _ from "lodash";
import {
  Connection, AwaitableSender, EventContext, AwaitableSenderOptions, Message, Delivery
} from "rhea-promise";
import logger from "../../utils/logger";
type SendFunction = (message: Message) => Promise<Delivery>

const _createSender = (connection: Connection, senderName: string, senderAddress: string) : Promise<AwaitableSender> => {
  const awaitableSenderOptions  : AwaitableSenderOptions = {
    name: senderName,
    target: {
      address: senderAddress
    },
    onError: (context: EventContext) => {
      const senderError = context.sender && context.sender.error;
      if (senderError) {
        logger.error(`[${connection.id}] An error occurred for sender '${senderName}': `, senderError);
      }
    },
    onSessionError: (context: EventContext) => {
      const sessionError = context.session && context.session.error;
      if (sessionError) {
        logger.error(`[${connection.id}] An error occurred for session of sender '${senderName}': `, sessionError);
      }
    }
  };
  return connection.createAwaitableSender(awaitableSenderOptions);
};

const sender = async (connection: Connection, connectionPoolSize: number, queueName: string) : Promise<SendFunction> => {
  const senders = await Promise.all(
    _.range(0, connectionPoolSize).map(() => _createSender(connection, "lol", queueName))
  );
  let index = 0;
  return async (message: Message) : Promise<Delivery> => {
    const sender = senders[index++];
    if(index === senders.length) index = 0;
    return sender.send(message);
  };
}; 
export default sender;
export type { SendFunction };
