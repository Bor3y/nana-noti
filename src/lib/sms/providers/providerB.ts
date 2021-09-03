import { SMSRequest } from "SMSRequest";
import logger from "../../../utils/logger";

export default async (message: SMSRequest) : Promise<void|never> => {
  logger.info(`ProviderB: send sms with body: "${message.message}" to: ${message.to.join(", ")}`);
};