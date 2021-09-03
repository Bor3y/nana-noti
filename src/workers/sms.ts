import { worker } from "./worker";
import handle from "../lib/sms/handler";

worker("SMS", handle);