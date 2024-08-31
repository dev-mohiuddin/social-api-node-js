import { Router } from "express";
import quicker from "../utils/quicker.js";
import httpError from "../utils/httpError.js";
import httpResponse from "../utils/httpResponse.js";

const router = Router();

router.get("/health", (req, res) => {
    try {
        const healthData = {
            application: quicker.getApplicationHelth(),
            system: quicker.getSystemHelth(),
            timestamp: Date.now()
        }
        httpResponse(req, res, 200, healthData, "Health check success");
        
    } catch (error) {
        httpError(next, error, req, 500)
    }
});

export default router;