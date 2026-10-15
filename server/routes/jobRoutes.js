import { Router } from "express"; 
import { protect } from "../middleware/authMiddleware.js"; 
import { allowRoles } from "../middleware/roleMiddleware.js"; 
import { listJobs, getJob, createJob, updateJob, deleteJob, closeJob, myJobs } from "../controllers/jobController.js"; 

const router = Router(); 

router.get("/recruiter/my-jobs", protect, allowRoles("recruiter", "admin"), myJobs);
router.get("/", listJobs); 
router.get("/search", listJobs); 
router.get("/:id", getJob); 
router.post("/", protect, allowRoles("recruiter", "admin"), createJob); 
router.put("/:id/close", protect, allowRoles("recruiter", "admin"), closeJob);
router.put("/:id", protect, allowRoles("recruiter", "admin"), updateJob); 
router.delete("/:id", protect, allowRoles("recruiter", "admin"), deleteJob); 

export default router;

