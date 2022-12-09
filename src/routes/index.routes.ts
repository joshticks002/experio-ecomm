import { Router, Request, Response, NextFunction } from "express"
import authRouter from "./auth.routes"
import productRouter from "./products.routes"
import validateToken from "../middleware/authentication"

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Service running fine",
        data: {},
        status: true,
    })
})

router.use(authRouter)
router.use(validateToken)
router.use(productRouter)

router.use(function(req: Request, res: Response, next: NextFunction) {
    res.status(404).render('error', {
      message: "Page not found"
    });
});

export default router;