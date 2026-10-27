/**
 * SnapOrder kiosk lane mock.
 *   POST /api/v1/kiosk/login
 *   GET  /api/v1/kiosk/bootstrap
 *   POST /api/v1/kiosk/sensor/presence
 *   GET  /api/v1/kiosk/conversations/:id/events?after=
 *   POST /api/v1/kiosk/conversations/:id/end
 *   POST /api/v1/kiosk/reset
 *
 * Password for every demo account: demo-lane
 */
const http = require("http");
const PORT = process.env.PORT || 4500;
const JSON_HEADER = { "Content-Type": "application/json" };
const PASSWORD = "demo-lane";

const day = {
  brand: "#0e8c8c",
  brand_soft: "#e5f6f6",
  surface: "#eaf0f0",
  surface_raised: "#ffffff",
  ink: "#0b1f22",
  muted: "#43575b",
  accent: "#f5a623",
  danger: "#c0392b",
  radius: "14px",
  scheme: "light",
  on_brand: "#ffffff",
};

const night = {
  brand: "#2bc4c4",
  brand_soft: "#12383c",
  surface: "#050f11",
  surface_raised: "#0d2125",
  ink: "#e8f2f1",
  muted: "#aec1c2",
  accent: "#f2a63c",
  danger: "#fca5a5",
  radius: "14px",
  scheme: "dark",
  on_brand: "#062021",
};

const copy = {
  ar: {
    idle_title: "في انتظار سيارة",
    idle_hint: "الشاشة تبقى هادئة حتى تصل سيارة إلى المسار.",
    listening: "نستمع",
    speaking: "الوكيل يتحدث",
    car_arrived: "وصلت سيارة",
    end_lane: "إنهاء المسار",
    fallback_notice: "هذا القالب غير معروف. نعرض مسار المسرح بدلاً منه.",
  },
  en: {
    idle_title: "Waiting for a car",
    idle_hint: "The lane stays quiet until a car arrives.",
    listening: "Listening",
    speaking: "Agent speaking",
    car_arrived: "Car arrived",
    end_lane: "End lane",
    fallback_notice: "That template is unknown. Showing the stage lane instead.",
  },
};

function lines(locale, name) {
  if (locale === "ar") {
    return [
      `أهلاً، أنا ${name}. ماذا تحب أن تطلب؟`,
      "وجبة المسار ووجبة العائلة متاحتان الآن.",
      "قل طلبك عندما تكون جاهزاً.",
    ];
  }
  return [
    `Hello, I am ${name}. What would you like?`,
    "The lane meal and the family meal are available.",
    "Tell me the order when you are ready.",
  ];
}

const accounts = {
  "lane.en@demo": account("lane-stage", day, "en", "Nora", "Day Lane", "Olaya"),
  "lane.stage@demo": account("lane-stage", night, "ar", "Lina", "Noon Lane", "Olaya"),
};

function account(templateId, theme, locale, agentName, vendor, branch) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return {
    template_id: templateId,
    theme,
    locale,
    dir,
    agent: { name: agentName },
    vendor: { id: vendor.toLowerCase().replace(/\s+/g, "-"), name: vendor },
    branch: { id: branch.toLowerCase(), name: branch },
    kiosk: { id: `${templateId}-${locale}`, name: vendor },
    copy: copy[locale],
    script: lines(locale, agentName),
  };
}

const server = http.createServer(async (req, res) => {
  const bodyPromise = readJson(req);
  const url = new URL(req.url || "/", "http://127.0.0.1");
  const path = url.pathname;
  const method = req.method || "GET";

  // @endpoint POST /api/v1/kiosk/reset
  if (method === "POST" && path === "/api/v1/kiosk/reset") {
    await pm.state.set("sessions", {});
    await pm.state.set("conversations", {});
    return send(res, 200, { data: { reset: true } });
  }

  // @endpoint POST /api/v1/kiosk/login
  if (method === "POST" && path === "/api/v1/kiosk/login") {
    const body = await bodyPromise;
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!accounts[email]) {
      return send(res, 422, {
        message: "Those credentials do not match a kiosk account.",
        errors: { email: ["No kiosk uses that work email."] },
      });
    }
    if (password !== PASSWORD) {
      return send(res, 422, {
        message: "Those credentials do not match a kiosk account.",
        errors: { password: ["That password does not open this lane."] },
      });
    }
    const token = `kiosk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const sessions = (await pm.state.get("sessions")) || {};
    sessions[token] = email;
    await pm.state.set("sessions", sessions);
    const lane = accounts[email];
    return send(res, 200, {
      data: {
        token,
        kiosk: lane.kiosk,
        branch_id: lane.branch.id,
        vendor_id: lane.vendor.id,
      },
    });
  }

  const lane = await laneFor(req);
  if (!lane) return send(res, 401, { message: "Sign in to open this lane." });

  // @endpoint GET /api/v1/kiosk/bootstrap
  if (method === "GET" && path === "/api/v1/kiosk/bootstrap") {
    return send(res, 200, {
      data: {
        kiosk: lane.kiosk,
        branch: lane.branch,
        vendor: lane.vendor,
        locale: lane.locale,
        dir: lane.dir,
        template_id: lane.template_id,
        theme: lane.theme,
        agent: lane.agent,
        copy: lane.copy,
      },
    });
  }

  // @endpoint POST /api/v1/kiosk/sensor/presence
  if (method === "POST" && path === "/api/v1/kiosk/sensor/presence") {
    const conversations = (await pm.state.get("conversations")) || {};
    const existing = Object.values(conversations).find((item) => item.email === lane.email && item.open);
    if (existing) {
      return send(res, 200, { data: { conversation_id: existing.id, state: "listening" } });
    }
    const id = `conv_${Date.now().toString(36)}`;
    conversations[id] = { id, email: lane.email, open: true, delivered: 0 };
    await pm.state.set("conversations", conversations);
    return send(res, 201, { data: { conversation_id: id, state: "listening" } });
  }

  const eventsMatch = path.match(/^\/api\/v1\/kiosk\/conversations\/([^/]+)\/events$/);
  // @endpoint GET /api/v1/kiosk/conversations/:id/events
  if (method === "GET" && eventsMatch) {
    const conversations = (await pm.state.get("conversations")) || {};
    const conversation = conversations[eventsMatch[1]];
    if (!conversation || conversation.email !== lane.email) {
      return send(res, 404, { message: "Conversation not found." });
    }
    const after = Number(url.searchParams.get("after") || 0);
    const script = scriptFor(lane);
    const pending = script.filter((event) => event.id > after);
    const one = pending[0] ? [pending[0]] : [];
    if (one[0]) conversation.delivered = one[0].id;
    conversations[conversation.id] = conversation;
    await pm.state.set("conversations", conversations);
    return send(res, 200, { data: { events: one, cursor: one[0] ? one[0].id : after } });
  }

  const endMatch = path.match(/^\/api\/v1\/kiosk\/conversations\/([^/]+)\/end$/);
  // @endpoint POST /api/v1/kiosk/conversations/:id/end
  if (method === "POST" && endMatch) {
    const conversations = (await pm.state.get("conversations")) || {};
    const conversation = conversations[endMatch[1]];
    if (!conversation || conversation.email !== lane.email) {
      return send(res, 404, { message: "Conversation not found." });
    }
    conversation.open = false;
    conversations[conversation.id] = conversation;
    await pm.state.set("conversations", conversations);
    return send(res, 200, { data: { conversation_id: conversation.id, state: "ended" } });
  }

  return send(res, 404, {
    error: "Endpoint not defined",
    message: `Please add ${path} endpoint to this mock.`,
  });
});

function scriptFor(lane) {
  const spoken = lane.script.flatMap((text, index) => {
    const id = index + 2;
    return [{ id, type: "agent.transcript", text, final: true }];
  });
  return [{ id: 1, type: "agent.state", state: "listening" }, ...spoken.map((event, index) => ({ ...event, id: index + 2 }))];
}

async function laneFor(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const sessions = (await pm.state.get("sessions")) || {};
  const email = sessions[token];
  if (!email || !accounts[email]) return null;
  return { ...accounts[email], email };
}

function send(res, status, payload) {
  res.writeHead(status, JSON_HEADER);
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        resolve(parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {});
      } catch {
        resolve({});
      }
    });
  });
}

server.listen(PORT, () => {
  console.log(`Mock server on port ${PORT}`);
});
