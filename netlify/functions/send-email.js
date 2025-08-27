// netlify/functions/send-email.js

export default async (request) => {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json", "Allow": "POST" },
        });
    }

    // Basic anti-spam: simple honeypot + size checks
    let data;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { name, email, message, _hp } = data; // _hp is hidden honeypot field
    if (_hp) {
        return new Response(JSON.stringify({ error: "Bot detected" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    if (String(message).length > 2000) {
        return new Response(JSON.stringify({ error: "Message too long" }), {
            status: 413,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Build EmailJS payload (uses secrets from env)
    const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,     // "user_id" = Public Key
        // Private key is optional but recommended if enabled in your EmailJS account
        accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined,
        template_params: {
            from_name: name,
            reply_to: email,
            message: message,
        },
    };

    // Call EmailJS REST API
    const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const text = await resp.text(); // EmailJS may return JSON or text
    const ok = resp.status >= 200 && resp.status < 300;

    return new Response(text, {
        status: ok ? 200 : resp.status,
        headers: { "Content-Type": "application/json" },
    });
};
