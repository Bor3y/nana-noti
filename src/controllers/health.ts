import { Request, Response } from "express";
import { container } from "../app";

/**
 * App Health.
 * @route GET /health
 */
export const health = async (req: Request, res: Response): Promise<void> => {
  if (!container.amqpConnection.isOpen()) throw Error("amqp connection");
  return res.status(200).json({
    message: "App is Healthy"
  }).end();
};

/**
 * @swagger
 * /health:
 *   get:
 *     summary: check service health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: App is Healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'App is Healthy'
 *       500:
 *         description: App is Not Healthy
*/
