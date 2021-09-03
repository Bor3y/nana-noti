import _ from "lodash";
import { SMSRequest } from "SMSRequest";
import logger from "../../../utils/logger";
import { RateLimitError } from "../../../workers/worker";

export default async (message: SMSRequest) : Promise<void|never> => {
  // through rate limit error randomly 
  if (_.random(0,2) == 0) throw new RateLimitError("rate limit reached", 20000);
  logger.info(`ProviderA: send sms with body: "${message.message}" to: ${message.to.join(", ")}`);
};