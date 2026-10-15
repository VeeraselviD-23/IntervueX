import { Router } from "express"; 
import { protect } from "../middleware/authMiddleware.js"; 
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  profile,
  updateProfile,
  dashboard,
  applicants,
  getApplicant,
  updateApplicant,
  scheduleInterview
} from "../controllers/recruiterController.js";

const router = Router(); 

router.get("/profile", protect, profile); 
router.put("/profile", protect, updateProfile); 
router.get("/dashboard", protect, dashboard); 

// Recruiter Applicants & Interview routes
router.get("/applicants", protect, applicants);
router.get("/applicants/:id", protect, getApplicant);
router.get("/jobs/:jobId/applicants", protect, applicants); 
router.put("/applicants/:id/interview", protect, scheduleInterview);
router.put("/applicants/:id", protect, updateApplicant); 

// Admin manage recruiters
router.get("/", listUsers); 
router.get("/:id", getUser); 
router.post("/", protect, allowRoles("admin"), createUser); 
router.put("/:id", protect, allowRoles("admin"), updateUser); 
router.delete("/:id", protect, allowRoles("admin"), deleteUser); 

export default router;

