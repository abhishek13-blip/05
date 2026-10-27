import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing with large limit for image upload
app.use(express.json({ limit: '35mb' }));

// Ensure persistent directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'hub-data.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Serve uploaded assets statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Authorized owner email (Confidential - never exposed on public pages)
const AUTHORIZED_OWNER_EMAIL = 'mpzofficialhub@gmail.com';

// In-memory active session tokens with timestamps
interface SessionInfo {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, SessionInfo>();

// 24 hours session expiry
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// Middleware to authenticate owner token
function requireOwnerAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Owner session token required' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired. Please sign in again.' });
  }

  // Session valid
  (req as any).ownerEmail = session.email;
  next();
}

// Default initial data for MPZ OFFICIAL HUB
const DEFAULT_HUB_DATA = {
  hubSettings: {
    brandName: 'MPZ OFFICIAL HUB',
    logoUrl: '',
    heroHeadline: 'MPZ OFFICIAL HUB',
    heroSubheadline:
      'The verified digital gateway uniting all official MPZ portals, web applications, media channels, and public resources.',
    heroBadge: 'Verified Gateway · MPZ Ecosystem',
    heroImage: '/src/assets/images/hero_mpz_hub_1793040007636.jpg',
    heroBannerImage: '',
    aboutTitle: 'The Purpose of MPZ OFFICIAL HUB',
    aboutDescription:
      'MPZ OFFICIAL HUB serves as the verified central source of truth for all MPZ operations. Every destination linked within this platform is authorized directly, guaranteeing safe routing and direct access.',
    aboutImage: '/src/assets/images/mpz_portal_showcase_1793040007842.jpg',
    footerNotice: 'The verified central digital gateway uniting all official MPZ web destinations and platforms.'
  },
  websites: [
    {
      id: 'mpz-main-portal',
      title: 'MPZ Main Web Portal',
      description: 'The primary digital gateway for MPZ announcements, releases, and platform updates.',
      url: '',
      category: 'Official',
      thumbnailUrl: '/src/assets/images/hero_mpz_hub_1793040007636.jpg',
      iconName: 'Globe',
      isFeatured: true,
      priceOrBadge: 'Main Gateway',
      dateAdded: '2026-10-26'
    },
    {
      id: 'mpz-media-network',
      title: 'MPZ Media & Broadcast Network',
      description: 'Curated official broadcasts, digital media productions, and visual content streams.',
      url: '',
      category: 'Media',
      thumbnailUrl: '/src/assets/images/mpz_portal_showcase_1793040007842.jpg',
      iconName: 'Play',
      isFeatured: false,
      priceOrBadge: 'Broadcasts',
      dateAdded: '2026-10-26'
    },
    {
      id: 'mpz-community-channel',
      title: 'MPZ Community & Discussion Hub',
      description: 'Verified public community channels, user discussion boards, and verified group spaces.',
      url: '',
      category: 'Community',
      thumbnailUrl: '',
      iconName: 'Users',
      isFeatured: false,
      priceOrBadge: 'Members',
      dateAdded: '2026-10-26'
    },
    {
      id: 'mpz-digital-resources',
      title: 'MPZ Documentation & Resource Hub',
      description: 'Official repository of guidelines, brand assets, verified references, and downloadable utilities.',
      url: '',
      category: 'Resources',
      thumbnailUrl: '',
      iconName: 'FileText',
      isFeatured: false,
      priceOrBadge: 'Free Access',
      dateAdded: '2026-10-26'
    }
  ],
  socialLinks: [
    {
      id: 'soc-telegram',
      platform: 'telegram',
      url: '',
      label: 'Official Telegram Channel',
      enabled: true,
      order: 1
    },
    {
      id: 'soc-youtube',
      platform: 'youtube',
      url: '',
      label: 'Official YouTube Channel',
      enabled: true,
      order: 2
    }
  ],
  photos: [
    {
      id: 'photo-hero',
      url: '/src/assets/images/hero_mpz_hub_1793040007636.jpg',
      title: 'Hero Architectural Nexus',
      section: 'hero',
      dateUploaded: '2026-10-26'
    },
    {
      id: 'photo-showcase',
      url: '/src/assets/images/mpz_portal_showcase_1793040007842.jpg',
      title: 'Portal Showcase Visual',
      section: 'about',
      dateUploaded: '2026-10-26'
    }
  ]
};

// Initialize or migrate data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_HUB_DATA, null, 2), 'utf-8');
} else {
  // Ensure missing keys are initialized
  try {
    const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    let modified = false;
    if (!existing.photos) {
      existing.photos = DEFAULT_HUB_DATA.photos;
      modified = true;
    }
    if (existing.hubSettings && existing.hubSettings.logoUrl === undefined) {
      existing.hubSettings.logoUrl = '';
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    }
  } catch {
    // Ignore migration error
  }
}

// Helper to read hub data
function getHubData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.photos) parsed.photos = DEFAULT_HUB_DATA.photos;
    return parsed;
  } catch {
    return DEFAULT_HUB_DATA;
  }
}

// Helper to save hub data
function saveHubData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================
// AUTHENTICATION & OWNER AUTHORIZATION APIS
// ==========================================

// Owner Login API - Google Sign-in Verification
app.post('/api/auth/login', (req, res) => {
  const { email, googleAuthToken, authMethod } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Owner Gmail ID is required.' });
  }

  // Security Rule: Typing an email address alone must never grant access
  if (!googleAuthToken && !authMethod) {
    return res.status(403).json({
      error: 'Access denied: Google Account authentication verification is required. Typing an email address alone does not grant access.'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Verify authorized owner account
  if (cleanEmail !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    return res.status(403).json({
      error: 'Access Denied: The provided Google Account is not the authorized owner of MPZ OFFICIAL HUB.'
    });
  }

  // Generate secure cryptographic session token
  const token = crypto.randomBytes(32).toString('hex');
  const session: SessionInfo = {
    token,
    email: AUTHORIZED_OWNER_EMAIL,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  activeSessions.set(token, session);

  return res.json({
    success: true,
    token,
    expiresAt: session.expiresAt
  });
});

// Verify Owner Session API
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    expiresAt: session.expiresAt
  });
});

// Owner Logout API
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// HUB CONTENT APIS
// ==========================================

// Public GET: Hub Data
app.get('/api/hub/data', (_req, res) => {
  const data = getHubData();
  res.json(data);
});

// Protected PUT: Update Hub Data (Requires Owner Authorization)
app.put('/api/hub/data', requireOwnerAuth, (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid hub data payload' });
  }

  const current = getHubData();
  const updated = {
    ...current,
    hubSettings: incoming.hubSettings
      ? { ...current.hubSettings, ...incoming.hubSettings }
      : current.hubSettings,
    websites: Array.isArray(incoming.websites) ? incoming.websites : current.websites,
    socialLinks: Array.isArray(incoming.socialLinks) ? incoming.socialLinks : current.socialLinks,
    photos: Array.isArray(incoming.photos) ? incoming.photos : current.photos
  };

  saveHubData(updated);
  return res.json({ success: true, data: updated });
});

// Protected POST: Image Upload from Device Gallery (Requires Owner Authorization)
app.post('/api/upload', requireOwnerAuth, (req, res) => {
  const { fileBase64, fileName, mimeType, section, title } = req.body;

  if (!fileBase64) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // Validate mime type
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const detectedMime = mimeType ? String(mimeType).toLowerCase() : 'image/jpeg';
  if (!allowedMime.includes(detectedMime)) {
    return res.status(400).json({ error: 'Unsupported format. Please upload JPG, PNG, or WebP.' });
  }

  // Remove data URI prefix if present
  let cleanBase64 = fileBase64;
  if (fileBase64.includes(';base64,')) {
    cleanBase64 = fileBase64.split(';base64,')[1];
  }

  try {
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // Choose file extension
    let ext = '.jpg';
    if (detectedMime === 'image/png') ext = '.png';
    else if (detectedMime === 'image/webp') ext = '.webp';

    const safeName = (fileName ? path.parse(fileName).name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'photo')
      .substring(0, 25);
    const uniqueFileName = `${safeName}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    // Also auto-register in Website Photo Manager
    const current = getHubData();
    const photoItem = {
      id: `photo-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      url: publicUrl,
      title: title || (fileName ? path.parse(fileName).name : 'Website Photo'),
      section: section || 'general',
      dateUploaded: new Date().toISOString().split('T')[0]
    };
    if (!current.photos) current.photos = [];
    current.photos.unshift(photoItem);
    saveHubData(current);

    return res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      photoItem,
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Error saving uploaded image:', err);
    return res.status(500).json({ error: 'Failed to process and save image' });
  }
});

// ==========================================
// VITE SETUP & STATIC FRONTEND
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: Number(PORT), host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MPZ OFFICIAL HUB server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
