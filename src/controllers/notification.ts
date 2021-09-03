import _ from "lodash";
import { Request, Response } from "express";
import { enqueue } from "../lib/sms/enqueue";
import { container } from "../app";

/**
 * send Notification.
 * @route POST /sms
 */
export const sms = async (req: Request, res: Response): Promise<void> => {
  const data = _.pick(req.body, ["to", "message", "deliveryDate"]);
  await enqueue(container.sendSms)(data);
  
  res.status(201).json({
    message: "message Accepted"
  }).end();
};

/**
 * @swagger
 * /api/sms:
 *   post:
 *     summary: check service health
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - to
 *             properties:
 *               to: 
 *                 type: array
 *                 items: 
 *                   type: string
 *                   description: numbers in international format only
 *                   example: "+201145244288"
 *               message:
 *                 type: string
 *                 example: 'Hi, man'
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *                 description: time should be in utc
 *     responses:
 *       201:
 *         description: message Accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'message Accepted'
 *       400:
 *         description: validation error
*/
