import _ from "lodash";

export const getDeliveryTimeAnnotations = (deliveryDate: string) : any => {
  if (_.isNil(deliveryDate)) return;
  return {
    "x-opt-delivery-time": Date.parse(deliveryDate),
  }; 
};