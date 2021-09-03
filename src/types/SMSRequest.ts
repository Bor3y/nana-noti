export interface NotificationRequest{
  deliveryDate?: string // ISO Date
}
export interface SMSRequest extends NotificationRequest {
  to: String[],
  message: String, 
}