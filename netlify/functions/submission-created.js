// Fires automatically on every Netlify form submission
// Sends: 1) confirmation email to submitter, 2) adds to SendGrid marketing list

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "hi@speedyheadshots.com";
const FROM_NAME = "SpeedyHeadshots";
const CONFIRMATION_TEMPLATE_ID = "d-52e25236d6d146f8b9563c423c67dc35";
const MARKETING_LIST_ID = process.env.SENDGRID_LIST_ID; // set after creating list

async function sendRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
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

    if (!email) {
      return { statusCode: 400, body: "No email in submission" };
    }

    // 1. Send branded confirmation email to submitter
    const confirmResult = await sendRequest(
      "https://api.sendgrid.com/v3/mail/send",
      "POST",
      {
        from: { email: FROM_EMAIL, name: FROM_NAME },
        reply_to: { email: FROM_EMAIL, name: FROM_NAME },
        personalizations: [{
          to: [{ email, name }],
          dynamic_template_data: {
            first_name: firstName,
            full_name: name,
            session_type: sessionType,
            phone,
            message,
          }
        }],
        template_id: CONFIRMATION_TEMPLATE_ID,
      }
    );

    console.log(`Confirmation email: ${confirmResult.status}`);

    // 2. Notify hi@speedyheadshots.com
    await sendRequest(
      "https://api.sendgrid.com/v3/mail/send",
      "POST",
      {
        from: { email: FROM_EMAIL, name: FROM_NAME },
        personalizations: [{
          to: [{ email: FROM_EMAIL, name: FROM_NAME }],
          dynamic_template_data: {}
        }],
        subject: `New enquiry from ${name} — ${sessionType}`,
        content: [{
          type: "text/html",
          value: `
            <h2>New SpeedyHeadshots enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Session type:</strong> ${sessionType}</p>
            <p><strong>Message:</strong> ${message}</p>
          `
        }],
      }
    );

    // 3. Add to SendGrid marketing list for drip campaign
    if (MARKETING_LIST_ID) {
      const contactResult = await sendRequest(
        "https://api.sendgrid.com/v3/marketing/contacts",
        "PUT",
        {
          list_ids: [MARKETING_LIST_ID],
          contacts: [{
            email,
            first_name: firstName,
            last_name: name.split(" ").slice(1).join(" ") || "",
            custom_fields: {
              session_type: sessionType,
              phone,
            }
          }]
        }
      );
      console.log(`Contact added to list: ${contactResult.status}`);
    }

    return { statusCode: 200, body: "OK" };

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: err.message };
  }
};
