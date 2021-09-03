import { Connection, Receiver, EventContext, ReceiverOptions } from "rhea-promise";
import logger from "../../utils/logger";

export const receiver = (connection: Connection, receiverName: string, receiverAddress: string) : Promise<Receiver> => {
  const receiverOptions: ReceiverOptions = {
    name: receiverName,
    autoaccept: false,
    source: {
      address: receiverAddress
    },
    onSessionError: (context: EventContext) => {
      const sessionError = context.session && context.session.error;
      if (sessionError) {
        logger.error(`[${connection.id}] An error occurred for session of sender '${receiverName}': `, sessionError);
      }
    }
  };
  return connection.createReceiver(receiverOptions);
};
