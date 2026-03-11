const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); 

/* ===============================
   TASK ASSIGNED EMAIL (EXISTING)
   =============================== */

const sendTaskAssignedEmail = async (toEmail, taskData) => {
  try {
    const mailOptions = {
      from: `"Ahaan Software" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `New Task Assigned: ${taskData.title}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table align="center" width="100%" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;">

<tr>
<td style="background:#111827;padding:20px;text-align:center;color:white;">
<h2 style="margin:0;">Ahaan Software Consulting</h2>
</td>
</tr>

<tr>
<td style="padding:30px;">
<h2>📌 New Task Assigned</h2>

<p>You have been assigned a new task.</p>

<p><strong>Title:</strong> ${taskData.title}</p>

<p><strong>Description:</strong>
${taskData.description || "No description"}
</p>

<p><strong>Due Date:</strong>
${taskData.dueDate ? new Date(taskData.dueDate).toDateString() : "Not set"}
</p>

<p><strong>Priority:</strong> ${taskData.priority || "Low"}</p>

<div style="margin-top:25px;">
<a href="${process.env.FRONTEND_URL}/my-tasks"
style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
View Task
</a>
</div>

</td>
</tr>

</table>

</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Task email sent");
  } catch (error) {
    console.log("❌ Email error:", error);
  }
};

/* ===============================
   MEETING INVITE EMAIL (NEW)
   =============================== */

const sendMeetingInviteEmail = async (emails, meetingData) => {
  try {
    const mailOptions = {
      from: `"Ahaan Software" <${process.env.EMAIL_USER}>`,
      to: emails,
      subject: `Meeting Invitation: ${meetingData.title}`,

      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table align="center" width="100%" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;">

<tr>
<td style="background:#111827;padding:20px;text-align:center;color:white;">
<h2 style="margin:0;">Ahaan Software Consulting</h2>
<p style="margin:5px 0 0;font-size:12px;color:#9ca3af;">
Project Management System
</p>
</td>
</tr>

<tr>
<td style="padding:30px;">

<h2 style="margin-top:0;">📅 Meeting Scheduled</h2>

<p style="font-size:14px;color:#4b5563;">
A new meeting has been scheduled.
</p>

<div style="background:#f9fafb;padding:20px;border-radius:6px;margin:20px 0;">

<p><strong>Title:</strong> ${meetingData.title}</p>

<p><strong>Description:</strong><br/>
${meetingData.description || "No description"}
</p>

<p><strong>Date:</strong> ${meetingData.date}</p>

<p><strong>Time:</strong> ${meetingData.time}</p>

</div>

<div style="text-align:center;margin:30px 0;">

<a href="${meetingData.meetingLink}"
style="
background:#10b981;
color:white;
padding:12px 20px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Join Meeting
</a>

</div>

<p style="font-size:12px;color:#9CA3AF;text-align:center;">
Please join the meeting using the button above.
</p>

</td>
</tr>

<tr>
<td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
© ${new Date().getFullYear()} Ahaan Software. All rights reserved.
</td>
</tr>

</table>

</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Meeting invite email sent");
  } catch (error) {
    console.log("❌ Meeting email error:", error);
  }
};

module.exports = {
  sendTaskAssignedEmail,
  sendMeetingInviteEmail,
};
