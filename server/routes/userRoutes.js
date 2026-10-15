import { Router } from "express"; 
import { protect } from "../middleware/authMiddleware.js"; 
import {
  getProfile,
  updateProfile,
  getSavedJobs,
  saveJob,
  unsaveJob
} from "../controllers/userController.js"; 

const router = Router(); 
router.use(protect); 

router.get("/profile", getProfile); 
router.put("/profile", updateProfile); 

// Saved Jobs endpoints
router.get("/saved-jobs", getSavedJobs);
router.post("/saved-jobs/:jobId", saveJob);
router.delete("/saved-jobs/:jobId", unsaveJob);

export default router;

