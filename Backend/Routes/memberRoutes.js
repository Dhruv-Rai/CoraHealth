const express = require("express");
const router = express.Router();

const {
  addMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  addHealthLockerDoc,
  removeHealthLockerDoc,
  updateVaccineStatus,
} = require("../Controller/memberController");
const upload = require("../MiddleWare/upload");

// ── Core CRUD ────────────────────────────────────────────────────
router.post("/", upload.single("photo"), addMember);                 // POST   /api/members
router.get("/", getAllMembers);                                      // GET    /api/members
router.get("/:id", getMemberById);                                  // GET    /api/members/:id
router.put("/:id", upload.single("photo"), updateMember);            // PUT    /api/members/:id
router.delete("/:id", deleteMember);                                // DELETE /api/members/:id

// ── Health Locker (document link management) ─────────────────────
router.post("/:id/health-locker", upload.single("document"), addHealthLockerDoc);   // POST   /api/members/:id/health-locker
router.delete("/:id/health-locker/:docIndex", removeHealthLockerDoc);               // DELETE /api/members/:id/health-locker/:docIndex

// ── Vaccination Tracker (Newborn only) ───────────────────────────
router.put("/:id/vaccines/:vaccineIndex", updateVaccineStatus);     // PUT    /api/members/:id/vaccines/:vaccineIndex

module.exports = router;
