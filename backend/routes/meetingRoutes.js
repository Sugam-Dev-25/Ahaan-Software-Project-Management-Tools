const express = require("express");

const router = express.Router();

const { scheduleMeeting } = require("../controller/meetingController");

router.post("/schedule-meeting", scheduleMeeting);

module.exports = router;
