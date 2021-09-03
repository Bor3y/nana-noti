import { SMSRequest } from "SMSRequest";
import type { SendFunction } from "../amqp/sender";
import { validate } from "./validate";
import { getDeliveryTimeAnnotations } from "../notification/utlis";

export const enqueue = (sendSms: SendFunction) => async (data: SMSRequest) : Promise<boolean> => {
  validate(data);
  const delivery = await sendSms({
    body: data,
    priority: 2,
    message_annotations: {
      ...getDeliveryTimeAnnotations(data.deliveryDate)
    }
  });
  return delivery.settled;
};
