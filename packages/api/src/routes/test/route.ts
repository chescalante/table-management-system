import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "The api is working!" });
  } catch (error) {
    next(error);
  }
});

export default router;
