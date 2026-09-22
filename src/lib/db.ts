import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredUser {
  id: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  targetRole: string;
  userMetadata: {
    full_name?: string;
    phone?: string;
    target_role?: string;
    onboarding_completed?: boolean;
    career_profile?: any;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

interface DatabaseSchema {
  users: Record<string, StoredUser>; // keyed by user.id
  emailIndex: Record<string, string>; // lowercase email -> user.id
  phoneIndex: Record<string, string>; // normalized phone -> user.id
  sessions: Record<string, StoredSession>; // token -> StoredSession
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "auth_db.json");

function ensureDatabaseExists(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        users: {},
        emailIndex: {},
        phoneIndex: {},
        sessions: {},
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, "utf8");
    if (!raw.trim()) {
      const initial: DatabaseSchema = {
        users: {},
        emailIndex: {},
        phoneIndex: {},
        sessions: {},
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }

    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error("Error reading auth database:", err);
    return {
      users: {},
      emailIndex: {},
      phoneIndex: {},
      sessions: {},
    };
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Atomic write via temp file
    const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error saving auth database:", err);
    // Fallback direct write
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
    } catch (e) {
      console.error("Critical: Failed direct write to auth db:", e);
    }
  }
}

// Cryptographic Password Hashing using Node's standard crypto.scryptSync
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt,
  };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const { hash } = hashPassword(password, salt);
    const storedBuf = Buffer.from(storedHash, "hex");
    const derivedBuf = Buffer.from(hash, "hex");
    if (storedBuf.length !== derivedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(storedBuf, derivedBuf);
  } catch (err) {
    return false;
  }
}

export function findUserByIdentifier(identifier: string): StoredUser | null {
  const db = ensureDatabaseExists();
  const clean = identifier.trim().toLowerCase();

  // 1. Email lookup
  const userIdFromEmail = db.emailIndex[clean];
  if (userIdFromEmail && db.users[userIdFromEmail]) {
    return db.users[userIdFromEmail];
  }

  // 2. Phone lookup
  const digitsOnly = identifier.replace(/\D/g, "");
  const userIdFromPhone = db.phoneIndex[clean] || db.phoneIndex[digitsOnly];
  if (userIdFromPhone && db.users[userIdFromPhone]) {
    return db.users[userIdFromPhone];
  }

  // 3. Direct scan fallback
  for (const user of Object.values(db.users)) {
    if (user.email && user.email.toLowerCase() === clean) {
      return user;
    }
    if (user.phone && (user.phone === clean || user.phone.replace(/\D/g, "") === digitsOnly)) {
      return user;
    }
  }

  return null;
}

export function findUserById(id: string): StoredUser | null {
  const db = ensureDatabaseExists();
  return db.users[id] || null;
}

export function createUser(params: {
  email?: string;
  phone?: string;
  password: string;
  fullName?: string;
  targetRole?: string;
  userMetadata?: Record<string, any>;
}): { user: StoredUser; error?: string } {
  const db = ensureDatabaseExists();
  const emailClean = params.email?.trim().toLowerCase();
  const phoneClean = params.phone?.trim();
  const phoneDigits = phoneClean ? phoneClean.replace(/\D/g, "") : "";

  if (emailClean && (db.emailIndex[emailClean] || findUserByIdentifier(emailClean))) {
    return { user: null as any, error: "A user with this email address already exists." };
  }

  if (phoneDigits && (db.phoneIndex[phoneDigits] || findUserByIdentifier(phoneDigits))) {
    return { user: null as any, error: "A user with this phone number already exists." };
  }

  const { hash, salt } = hashPassword(params.password);
  const userId = `student_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newUser: StoredUser = {
    id: userId,
    email: params.email?.trim(),
    phone: params.phone?.trim(),
    passwordHash: hash,
    salt,
    fullName: params.fullName || "Student",
    targetRole: params.targetRole || "Junior Full Stack Developer",
    userMetadata: {
      full_name: params.fullName || "Student",
      phone: params.phone?.trim() || "",
      target_role: params.targetRole || "Junior Full Stack Developer",
      onboarding_completed: true,
      ...(params.userMetadata || {}),
    },
    createdAt: now,
    updatedAt: now,
  };

  db.users[userId] = newUser;
  if (emailClean) {
    db.emailIndex[emailClean] = userId;
  }
  if (phoneClean) {
    db.phoneIndex[phoneClean] = userId;
    if (phoneDigits) db.phoneIndex[phoneDigits] = userId;
  }

  saveDatabase(db);
  return { user: newUser };
}

export function updateUserProfile(
  userId: string,
  updates: {
    fullName?: string;
    targetRole?: string;
    userMetadata?: Record<string, any>;
  }
): StoredUser | null {
  const db = ensureDatabaseExists();
  const user = db.users[userId];
  if (!user) return null;

  if (updates.fullName) user.fullName = updates.fullName;
  if (updates.targetRole) user.targetRole = updates.targetRole;
  if (updates.userMetadata) {
    user.userMetadata = {
      ...user.userMetadata,
      ...updates.userMetadata,
    };
  }
  user.updatedAt = new Date().toISOString();

  db.users[userId] = user;
  saveDatabase(db);
  return user;
}

export function createSession(userId: string): StoredSession {
  const db = ensureDatabaseExists();
  const token = `career_os_tok_${crypto.randomBytes(24).toString("hex")}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const session: StoredSession = {
    token,
    userId,
    createdAt: now.toISOString(),
    expiresAt,
  };

  db.sessions[token] = session;
  saveDatabase(db);
  return session;
}

export function validateSession(token: string): { user: StoredUser | null; session: StoredSession | null } {
  if (!token) return { user: null, session: null };
  const db = ensureDatabaseExists();
  const session = db.sessions[token];

  if (!session) {
    return { user: null, session: null };
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    delete db.sessions[token];
    saveDatabase(db);
    return { user: null, session: null };
  }

  const user = db.users[session.userId];
  if (!user) {
    delete db.sessions[token];
    saveDatabase(db);
    return { user: null, session: null };
  }

  return { user, session };
}

export function deleteSession(token: string): boolean {
  if (!token) return false;
  const db = ensureDatabaseExists();
  if (db.sessions[token]) {
    delete db.sessions[token];
    saveDatabase(db);
    return true;
  }
  return false;
}

// Convert StoredUser to client-safe representation without hashes
export function toClientUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    user_metadata: {
      ...user.userMetadata,
      full_name: user.fullName,
      target_role: user.targetRole,
    },
    app_metadata: { provider: user.email ? "email" : "phone" },
    aud: "authenticated",
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}
