import nodemailer from "nodemailer";

export const sendNotification = async (email, productName, currentPrice, targetPrice) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"ShopNest Alerts" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `📉 Price Drop: ${productName} is now ₹${currentPrice}`,
            html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial; background:#f2f2f7; padding:32px;">
  <div style="
      max-width:520px; 
      margin:auto; 
      background:#ffffff; 
      border-radius:28px; 
      overflow:hidden; 
      box-shadow:0 16px 40px rgba(0,0,0,0.12);
      ">
      
    <!-- Apple Style Header -->
    <div style="padding:32px 24px; text-align:center; background:#ffffff;">
      <img src="https://raw.githubusercontent.com/shopnestwebapp-maker/Capstone-Project/refs/heads/main/backend/image.png"
           width="80" style="opacity:0.85; margin-bottom:14px;" />
      <h1 style="
          margin:0; 
          font-weight:600; 
          font-size:22px; 
          letter-spacing:-0.2px; 
          color:#111111;">
          Price Alert
      </h1>
      <p style="color:#6e6e73; font-size:14px; margin-top:6px;">
        Your ShopNest notification
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px; background:#e5e5ea;"></div>

    <!-- Body -->
    <div style="padding:28px 26px; text-align:center;">
      
      <!-- Big emoji style -->
      <div style="font-size:42px; margin-bottom:12px;">📉</div>

      <h2 style="margin:0; font-size:20px; font-weight:600; color:#1d1d1f; letter-spacing:-0.2px;">
        Great News!
      </h2>

      <p style="margin:12px 0 28px; color:#515154; font-size:16px; line-height:1.45;">
        The price of <b style="color:#0071e3;">${productName}</b> has dropped.
      </p>

      <!-- Apple-style price card -->
      <div style="
          background:#f5f5f7; 
          border-radius:20px; 
          padding:20px; 
          display:inline-block; 
          min-width:260px; 
          border:1px solid #e5e5ea;
          margin-bottom:24px;">
        
        <p style="margin:4px 0; font-size:16px; color:#1d1d1f;">
          <b>Current Price:</b> 
          <span style="color:#34c759; font-weight:600;">₹${currentPrice}</span>
        </p>

        <p style="margin:4px 0; font-size:16px; color:#1d1d1f;">
          <b>Your Target:</b> 
          <span style="color:#0071e3;">₹${targetPrice}</span>
        </p>
      </div>

      <p style="margin-top:4px; font-size:15px; color:#6e6e73; line-height:1.5;">
        This might be the perfect moment to grab it before the price changes again.
      </p>

    </div>

    <!-- Divider -->
    <div style="height:1px; background:#e5e5ea;"></div>

    <!-- Footer -->
    <div style="padding:20px 26px; text-align:center; color:#8e8e93; font-size:12px;">
      You are receiving this alert because you enabled price notifications in ShopNest.
      <br>
      © ${new Date().getFullYear()} ShopNest. All rights reserved.
    </div>

  </div>
</div>
`,
        };


        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}: ${info.messageId}`);

    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
};
