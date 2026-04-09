const express = require("express");
const router = express.Router();

const {
  createReminder,
  getRemindersByMember,
  getAllReminders,
  updateReminder,
  deleteReminder,
} = require("../Controller/reminderController");

// ── Reminder Routes ──────────────────────────────────────────────
router.post("/", createReminder);                          // POST   /api/reminders
router.get("/", getAllReminders);                          // GET    /api/reminders  (all, with member info)
router.get("/member/:memberId", getRemindersByMember);    // GET    /api/reminders/member/:memberId
router.put("/:id", updateReminder);                       // PUT    /api/reminders/:id
router.delete("/:id", deleteReminder);                    // DELETE /api/reminders/:id

module.exports = router;
