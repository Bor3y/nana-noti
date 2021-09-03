import { Request, Response, NextFunction } from "express";
export const asyncMiddleware = (action: any) => async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const ret = await action(req, res);
    if (res.headersSent) return;
    if (ret === undefined || ret === null) return res.status(204).send();
    return res.status(res.statusCode || 200).json(ret);
  } catch (err) {
    next(err);
  }
};