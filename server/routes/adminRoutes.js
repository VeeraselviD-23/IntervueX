import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  dashboard,
  users,
  recruiters,
  jobs,
  approveJob,
  rejectJob,
  closeJob,
  updateJob,
  deleteJob,
  applications,
  profile,
  updateProfile,
  changeAdminPassword,
  createHtmlFundamentalsTest
} from "../controllers/adminController.js";

const router = Router();
router.use(protect, allowRoles("admin"));

router.get("/dashboard", dashboard);
router.get("/users", users);
router.get("/recruiters", recruiters);

// Job moderation routes
router.get("/jobs", jobs);
router.put("/jobs/:id/approve", approveJob);
router.put("/jobs/:id/reject", rejectJob);
router.put("/jobs/:id/close", closeJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

router.get("/applications", applications);
router.post("/tests/html-fundamentals", createHtmlFundamentalsTest);
router.get("/profile", profile);
router.put("/profile", updateProfile);
router.put("/change-password", changeAdminPassword);

export default router;
