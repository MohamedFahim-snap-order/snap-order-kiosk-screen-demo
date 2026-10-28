import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { DEMO_PASSWORD } from "@/features/auth/constants/demo-accounts";

type Scheme = "light" | "dark";
type Locale = "ar" | "en";

type Theme = {
  brand: string;
  brand_soft: string;
  surface: string;
  surface_raised: string;
  ink: string;
  muted: string;
  accent: string;
  danger: string;
  radius: string;
  on_brand: string;
  scheme: Scheme;
};

type LaneAccount = {
  template_id: string;
  theme: Theme;
  locale: Locale;
  dir: "rtl" | "ltr";
  agent: { name: string };
  vendor: { id: string; name: string };
  branch: { id: string; name: string };
  kiosk: { id: string; name: string };
  copy: {
    idle_title: string;
    idle_hint: string;
    listening: string;
    speaking: string;
    car_arrived: string;
    end_lane: string;
    fallback_notice: string;
  };
  script: string[];
};

/** SnapOrder portal tokens. A future theme replaces this object; the screen still reads the same fields. */
const day: Theme = {
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

/** Portal dark tokens. Deep lane chrome — never wash toward light gray. */
const night: Theme = {
  brand: "#2bc4c4",
  brand_soft: "#0f2d31",
  surface: "#040c0e",
  surface_raised: "#0a1c20",
  ink: "#e8f2f1",
  muted: "#9fb4b6",
  accent: "#f2a63c",
  danger: "#fca5a5",
  radius: "14px",
  scheme: "dark",
  on_brand: "#042021",
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
} as const;

function lines(locale: Locale, name: string) {
  if (locale === "ar") {
    return [`أهلاً، أنا ${name}. ماذا تحب أن تطلب؟`, "وجبة المسار ووجبة العائلة متاحتان الآن.", "قل طلبك عندما تكون جاهزاً."];
  }
  return [`Hello, I am ${name}. What would you like?`, "The lane meal and the family meal are available.", "Tell me the order when you are ready."];
}

function account(templateId: string, theme: Theme, locale: Locale, agentName: string, vendor: string, branch: string): LaneAccount {
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

const accounts: Record<string, LaneAccount> = {
  "lane.en@demo": account("lane-stage", day, "en", "Nora", "MF - Lane", "Riyadh Branch"),
  "lane.stage@demo": account("lane-stage", night, "ar", "Lina", "MF - Lane", "Riyadh Branch"),
};

export type DemoLaneResult = { status: number; body: unknown };

type DemoLaneInput = {
  method: "GET" | "POST";
  path: string;
  token?: string;
  body?: unknown;
};

export async function runDemoLane(input: DemoLaneInput): Promise<DemoLaneResult> {
  const url = new URL(input.path, "http://kiosk.local");
  const path = url.pathname;

  if (input.method === "POST" && path === "/api/v1/kiosk/login") {
    return login(input.body);
  }

  const lane = laneFor(input.token);
  if (!lane) return { status: 401, body: { message: "Sign in to open this lane." } };

  if (input.method === "GET" && path === "/api/v1/kiosk/bootstrap") {
    return {
      status: 200,
      body: {
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
      },
    };
  }

  if (input.method === "POST" && path === "/api/v1/kiosk/sensor/presence") {
    const id = `conv_${randomBytes(6).toString("hex")}`;
    return { status: 201, body: { data: { conversation_id: id, state: "listening" } } };
  }

  const eventsMatch = path.match(/^\/api\/v1\/kiosk\/conversations\/([^/]+)\/events$/);
  if (input.method === "GET" && eventsMatch) {
    if (!isConversationId(eventsMatch[1])) return { status: 404, body: { message: "Conversation not found." } };
    const after = Number(url.searchParams.get("after") || 0);
    const pending = scriptFor(lane).filter((event) => event.id > after);
    const one = pending[0] ? [pending[0]] : [];
    return { status: 200, body: { data: { events: one, cursor: one[0] ? one[0].id : after } } };
  }

  const endMatch = path.match(/^\/api\/v1\/kiosk\/conversations\/([^/]+)\/end$/);
  if (input.method === "POST" && endMatch) {
    if (!isConversationId(endMatch[1])) return { status: 404, body: { message: "Conversation not found." } };
    return { status: 200, body: { data: { conversation_id: endMatch[1], state: "ended" } } };
  }

  return { status: 404, body: { message: "That lane endpoint is not available." } };
}

function login(body: unknown): DemoLaneResult {
  const record = body && typeof body === "object" ? body : {};
  const email = "email" in record && typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const password = "password" in record && typeof record.password === "string" ? record.password : "";
  const lane = accounts[email];
  if (!lane) {
    return {
      status: 422,
      body: { message: "Those credentials do not match a kiosk account.", errors: { email: ["No kiosk uses that work email."] } },
    };
  }
  if (password !== DEMO_PASSWORD) {
    return {
      status: 422,
      body: { message: "Those credentials do not match a kiosk account.", errors: { password: ["That password does not open this lane."] } },
    };
  }
  return {
    status: 200,
    body: { data: { token: signToken(email), kiosk: lane.kiosk, branch_id: lane.branch.id, vendor_id: lane.vendor.id } },
  };
}

function scriptFor(lane: LaneAccount) {
  return [
    { id: 1, type: "agent.state" as const, state: "listening" },
    ...lane.script.map((text, index) => ({ id: index + 2, type: "agent.transcript" as const, text, final: true })),
  ];
}

function laneFor(token: string | undefined) {
  const email = token ? readToken(token) : null;
  if (!email) return null;
  const lane = accounts[email];
  return lane ?? null;
}

function isConversationId(value: string) {
  return /^conv_[a-z0-9]+$/i.test(value);
}

function secret() {
  return process.env.KIOSK_DEMO_SECRET || "snap-order-kiosk-demo";
}

function signToken(email: string) {
  const body = Buffer.from(email, "utf8").toString("base64url");
  return `kiosk.${body}.${signature(body)}`;
}

function readToken(token: string) {
  const [prefix, body, sig] = token.split(".");
  if (prefix !== "kiosk" || !body || !sig) return null;
  const expected = signature(body);
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    return Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signature(body: string) {
  return createHmac("sha256", secret()).update(body).digest("base64url").slice(0, 24);
}
