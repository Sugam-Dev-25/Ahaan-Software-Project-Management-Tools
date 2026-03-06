const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String,
    time: String,
    emails: [String],
    meetingLink: String,
    roomId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Meeting", meetingSchema);
