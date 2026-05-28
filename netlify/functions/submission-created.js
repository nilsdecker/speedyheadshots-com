// Fires automatically on every Netlify form submission
// 1. Sends branded confirmation email to submitter via Brevo
// 2. Adds contact to Brevo list for drip campaign
// 3. Forwards submission details to hi@speedyheadshots.com

const BREVO_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = "hi@speedyheadshots.com";
const FROM_NAME = "SpeedyHeadshots";
const CONFIRMATION_TEMPLATE_ID = 1;
const LEADS_LIST_ID = 3; // SpeedyHeadshots Leads

async function brevo(method, path, body) {
  const response = await fetch(`https://api.brevo.com/v3/${path}`, {
    method,
    headers: {
      "api-key": BREVO_KEY,
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : {} };
}

exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body).payload;
    const data = payload.data || {};

    const name = data.name || "there";
    const email = data.email;
    const phone = data.phone || "";
    const sessionType = data["session-type"] || "Not specified";
    const message = data.message || "";
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ").slice(1).join(" ") || "";

    if (!email) {
      return { statusCode: 400, body: "No email in submission" };
    }

    // 1. Send branded confirmation email to submitter
    const confirmResult = await brevo("POST", "smtp/email", {
      to: [{ email, name }],
      templateId: CONFIRMATION_TEMPLATE_ID,
      params: {
        first_name: firstName,
        full_name: name,
        session_type: sessionType,
        phone,
        message,
      },
      headers: {
        "X-Mailin-custom": "speedyheadshots-confirmation",
      },
    });
    console.log(`Confirmation sent: ${confirmResult.status}`);

    // 2. Forward to hi@speedyheadshots.com
    await brevo("POST", "smtp/email", {
      to: [{ email: FROM_EMAIL, name: FROM_NAME }],
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      subject: `New enquiry from ${name} — ${sessionType}`,
      htmlContent: `
        <h2 style="font-family:sans-serif;color:#1B3F7A;">New SpeedyHeadshots enquiry</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px 0;color:#666;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Session</td><td style="padding:8px 0;">${sessionType}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || '—'}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#999;margin-top:24px;">Sent via speedyheadshots.com contact form</p>
      `,
    });

    // 3. Add contact to Brevo leads list for drip campaign
    const contactResult = await brevo("POST", "contacts", {
      email,
      firstName,
      lastName,
      listIds: [LEADS_LIST_ID],
      updateEnabled: true,
      attributes: {
        PHONE: phone,
        SESSION_TYPE: sessionType,
        SOURCE: "Contact Form",
      },
    });
    console.log(`Contact added: ${contactResult.status}`);

    return { statusCode: 200, body: "OK" };

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: err.message };
  }
};
