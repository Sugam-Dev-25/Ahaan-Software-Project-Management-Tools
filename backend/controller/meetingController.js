const Meeting = require("../models/Meeting");
const { v4: uuidv4 } = require("uuid");
const { sendMeetingInviteEmail } = require("../utils/sendEmail");

exports.scheduleMeeting = async (req, res) => {

try {

const { title, description, date, time, emails } = req.body;

const roomId = uuidv4();

const meetingLink = `https://meet.jit.si/Ahaan-${roomId}`;

const meeting = await Meeting.create({
title,
description,
date,
time,
emails,
meetingLink,
roomId,
});

await sendMeetingInviteEmail(emails.join(","), {
title,
description,
date,
time,
meetingLink
});

res.json({
success: true,
meeting
});

} catch (error) {

console.log("MEETING ERROR:", error);

res.status(500).json({
error: error.message
});

}

};