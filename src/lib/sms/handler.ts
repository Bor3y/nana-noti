import _ from "lodash";
import { SMSRequest } from "SMSRequest";
import { NotificationHandleFunc } from "../notification/handler";
import handlerA from "./providers/providerA";
import handlerB from "./providers/providerB";

const allowedProviders = process.env.SMS_PROVIDERS || "providerA";

const HandlersMap = {
  "providerA": handlerA,
  "providerB": handlerB
};

// default provider using env variable
// const provider = process.env.SMS_PROVIDER || "providerA";
// export default HandlersMap[provider];


// use multiple provider in round robin way
const handler = (fns: NotificationHandleFunc[]) => async (message: SMSRequest) : Promise<void|never> => {
  const fn = fns.shift();
  fns.push(fn);
  return fn(message);
};
export default handler(Object.values(_.pick(HandlersMap, allowedProviders.split(","))));
