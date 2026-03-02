const nodemailer = require("nodemailer");

const sendTaskAssignedEmail = async (toEmail, taskData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;">

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

    <!-- Header -->
    <tr>
      <td style="background:#111827;padding:20px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:20px;">Ahaan Software Consulting</h1>
        <p style="color:#9CA3AF;margin:5px 0 0;font-size:12px;">
          Project Management System
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px;">
        <h2 style="margin-top:0;color:#111827;">📌 New Task Assigned</h2>
        
        <p style="color:#4B5563;font-size:14px;line-height:1.6;">
          You have been assigned a new task. Please review the details below:
        </p>

        <!-- Task Box -->
        <div style="background:#f9fafb;padding:20px;border-radius:6px;margin:20px 0;">
          
          <p style="margin:0 0 10px; color:#000; font-size:18px;"><strong>Title:</strong> ${taskData.title}</p>
          
          <p style="margin:0 0 10px;">
            <strong>Description:</strong><br/>
            <span style="color:#000;font-size:14px;">
              ${taskData.description || "No description provided."}
            </span>
          </p>

          <p style="margin:0 0 10px;">
            <strong>Due Date:</strong> 
            ${taskData.dueDate ? new Date(taskData.dueDate).toDateString() : "Not set"}
          </p>

          <p style="margin:0;">
            <strong>Priority:</strong> 
            <span style="
              padding:4px 10px;
              border-radius:20px;
              font-size:12px;
              color:#fff;
              background:${
                taskData.priority === "High" ? "#dc2626" :
                taskData.priority === "Medium" ? "#f59e0b" :
                "#10b981"
              };
            ">
              ${taskData.priority || "Low"}
            </span>
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center;margin:30px 0;">
          <a href="${process.env.FRONTEND_URL}/my-tasks"
             style="
              background:#2563eb;
              color:#ffffff;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              font-size:14px;
              display:inline-block;
            ">
            View Task →
          </a>
        </div>

        <p style="font-size:12px;color:#9CA3AF;text-align:center;">
          Please do not reply to this email. This is an automated notification.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
        © ${new Date().getFullYear()} Ahaan Software. All rights reserved.
      </td>
    </tr>

  </table>

</body>
</html>
`
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Email error:", error);
  }
};

module.exports = sendTaskAssignedEmail;