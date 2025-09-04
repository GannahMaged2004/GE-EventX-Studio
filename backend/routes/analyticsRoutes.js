// The routes are extremely important in building a web application. 
// They define the endpoints of the application and the HTTP methods that can be used to interact with them.
// In this file, we define the routes for the analytics section of the application.


import express from "express";
import { getOverview, getDemographics, exportReportCSV, exportReportExcel } from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/overview", protect, admin, getOverview);
router.get("/demographics", protect, admin, getDemographics);
router.get("/export/csv", protect, admin, exportReportCSV);
router.get("/export/excel", protect, admin, exportReportExcel);

export default router;
