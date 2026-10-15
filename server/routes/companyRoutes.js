import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  listCompanys,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  myCompany,
  saveMyCompany
} from "../controllers/companyController.js";
const router = Router();
router.get("/mine", protect, allowRoles("recruiter"), myCompany);
router.put("/mine", protect, allowRoles("recruiter"), saveMyCompany);
router.get("/", listCompanys);
router.get("/:id", getCompany);
router.post("/", protect, allowRoles("admin"), createCompany);
router.put("/:id", protect, allowRoles("admin"), updateCompany);
router.delete("/:id", protect, allowRoles("admin"), deleteCompany);
export default router;
