import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const SITE_PASSWORD = process.env.SITE_PASSWORD as string;

if (!JWT_SECRET || !SITE_PASSWORD) {
  console.error('FATAL ERROR: JWT_SECRET or SITE_PASSWORD is not set in the environment.');
  process.exit(1);
}

const SUPER_ADMINS = (process.env.SUPER_ADMINS || 'david').split(',').map(s => s.trim().toLowerCase());

function isSuperAdmin(username: string): boolean {
  return SUPER_ADMINS.includes(username.toLowerCase());
}

const requireSuperAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = (req as any).user;
  if (!user || (user.isSuperAdmin === undefined ? !isSuperAdmin(user.username) : !user.isSuperAdmin)) {
    return res.status(403).json({ success: false, message: 'Endast superadmin kan utföra denna åtgärd.' });
  }
  next();
};

// ── Lightweight query helpers ───────────────────────────────────
let pool: mysql.Pool;

/** SELECT that returns an array of row-objects. */
async function queryAll(sql: string, params: any[] = []): Promise<any[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as any[];
}

/** SELECT that returns the first matching row, or undefined. */
async function queryOne(sql: string, params: any[] = []): Promise<any | undefined> {
  const [rows] = await pool.execute(sql, params);
  const arr = rows as any[];
  return arr.length > 0 ? arr[0] : undefined;
}

/** INSERT / UPDATE / DELETE — runs the statement and persists to disk. */
async function execute(sql: string, params: any[] = []): Promise<void> {
  await pool.execute(sql, params);
}

// ── Server ──────────────────────────────────────────────────────
async function startServer() {
  // Initialise MySQL connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.set('trust proxy', 1);

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { success: false, message: 'För många inloggningsförsök, vänligen försök igen senare.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const requireSiteAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.site_access_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Gästbehörighet saknas.' });
    }
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: 'Ogiltig sessionsnyckel för webbplatsen.' });
    }
  };

  const requireUserAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.user_session_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Användarbehörighet saknas.' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ success: false, message: 'Ogiltig sessionsnyckel för användare.' });
    }
  };

  await execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    )
  `);

  // Seeda standardanvändare om tabellen är tom
  try {
    const userCountRow = await queryOne('SELECT COUNT(*) as count FROM users');
    const userCount = userCountRow ? Number(userCountRow.count) : 0;
    if (userCount === 0) {
      const defaultUsers = [
        { username: 'david', password: 'david' },
        { username: 'daniel', password: 'daniel' },
        { username: 'pontus', password: 'pontus' },
        { username: 'thomas', password: 'thomas' },
        { username: 'gideon', password: 'gideon' },
      ];
      for (const u of defaultUsers) {
        const hash = bcrypt.hashSync(u.password, 10);
        await execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', [u.username, hash]);
      }
      console.log('Databasen har seedats med standardanvändare.');
    }
  } catch (err) {
    console.error('Fel vid seeding av databas:', err);
  }

  await execute(`
    CREATE TABLE IF NOT EXISTS adventures (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      language VARCHAR(50) NOT NULL,
      dm VARCHAR(255) NOT NULL,
      maxPlayers INT NOT NULL,
      spotsLeft INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      interestUrl TEXT NOT NULL,
      feedbackUrl TEXT NOT NULL,
      imageUrl TEXT
    )
  `);

  try {
    await execute("ALTER TABLE adventures ADD COLUMN imageUrl TEXT");
  } catch (e) {
    // Spalten finns redan, kan ignoreras
  }

  // Seeda standardäventyr om tabellen är tom
  try {
    const advCountRow = await queryOne('SELECT COUNT(*) as count FROM adventures');
    const advCount = advCountRow ? Number(advCountRow.count) : 0;
    if (advCount === 0) {
      await execute(`
        INSERT INTO adventures (id, title, date, time, language, dm, maxPlayers, spotsLeft, location, interestUrl, feedbackUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        "wolves-of-vargheim",
        "Wolves of Vargheim",
        "2026-02-01",
        "18:00",
        "SV/EN",
        "RFR DM Team",
        5,
        2,
        "Norrköping / Online",
        "https://forms.gle/YOUR_INTEREST_FORM",
        "/feedback?adventure=wolves-of-vargheim"
      ]);
      console.log('Databasen har seedats med standardäventyr.');
    }
  } catch (err) {
    console.error('Fel vid seeding av äventyr:', err);
  }

  app.post('/api/site-login', (req, res, next) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Lösenordsfras krävs.' });
    }
    next();
  }, loginLimiter, (req, res) => {
    const { password } = req.body;
    if (password === SITE_PASSWORD) {
      const token = jwt.sign({ siteAccess: true }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('site_access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, message: 'Felaktigt lösenord för värdshuset.' });
  });

  app.post('/api/user-login', requireSiteAccess, (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Användarnamn och lösenord krävs.' });
    }
    next();
  }, loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await queryOne('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username]);

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (isPasswordValid) {
          const token = jwt.sign({ id: user.id, username: user.username, isSuperAdmin: isSuperAdmin(user.username) }, JWT_SECRET, { expiresIn: '24h' });
          res.cookie('user_session_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
          return res.json({ success: true, username: user.username });
        }
      }
      res.status(401).json({ success: false, message: 'Felaktigt användarnamn eller lösenord.' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  // User CRUD Endpoints (Protected by both site access and user auth)
  app.get('/api/users', requireSiteAccess, requireUserAuth, async (req, res) => {
    try {
      const users = await queryAll('SELECT id, username FROM users ORDER BY id ASC');
      const mapped = users.map(u => ({
        id: u.id,
        username: u.username,
        isSuperAdmin: isSuperAdmin(u.username)
      }));
      res.json({ success: true, users: mapped });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  // Public endpoint (requires site access only) to list DMs for feedback form
  app.get('/api/dms-list', requireSiteAccess, async (req, res) => {
    try {
      const users = await queryAll('SELECT id, username FROM users ORDER BY username ASC');
      res.json({ success: true, users });
    } catch (error) {
      console.error('Error fetching DMs:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.post('/api/users', requireSiteAccess, requireUserAuth, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Användarnamn och lösenord krävs.' });
    }
    const trimmedUsername = username.trim();
    if (!trimmedUsername || password.length < 4) {
      return res.status(400).json({ success: false, message: 'Ogiltigt användarnamn eller lösenord (måste vara minst 4 tecken).' });
    }
    try {
      const existing = await queryAll('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [trimmedUsername]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Användarnamnet är redan upptaget.' });
      }

      const hash = await bcrypt.hash(password, 10);
      await execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', [trimmedUsername, hash]);
      res.json({ success: true, message: 'Användaren har skapats.' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.put('/api/users/:id', requireSiteAccess, requireUserAuth, async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
      return res.status(400).json({ success: false, message: 'Användarnamn eller lösenord krävs.' });
    }

    try {
      const userRow = await queryOne('SELECT * FROM users WHERE id = ?', [Number(id)]);
      if (!userRow) {
        return res.status(404).json({ success: false, message: 'Användaren hittades inte.' });
      }

      if (username) {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
          return res.status(400).json({ success: false, message: 'Användarnamnet kan inte vara tomt.' });
        }
        // Check if username is taken by someone else
        const existing = await queryAll('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?', [trimmedUsername, Number(id)]);
        if (existing.length > 0) {
          return res.status(400).json({ success: false, message: 'Användarnamnet är redan upptaget.' });
        }
        await execute('UPDATE users SET username = ? WHERE id = ?', [trimmedUsername, Number(id)]);
      }

      if (password) {
        if (password.length < 4) {
          return res.status(400).json({ success: false, message: 'Lösenordet måste vara minst 4 tecken.' });
        }
        const hash = await bcrypt.hash(password, 10);
        await execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, Number(id)]);
      }

      res.json({ success: true, message: 'Användaren har uppdaterats.' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.delete('/api/users/:id', requireSiteAccess, requireUserAuth, async (req, res) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    try {
      if (currentUser && currentUser.id === parseInt(id as string, 10)) {
        return res.status(400).json({ success: false, message: 'Du kan inte ta bort din egen inloggade användare.' });
      }

      const userRow = await queryOne('SELECT * FROM users WHERE id = ?', [Number(id)]);
      if (!userRow) {
        return res.status(404).json({ success: false, message: 'Användaren hittades inte.' });
      }

      await execute('DELETE FROM users WHERE id = ?', [Number(id)]);
      res.json({ success: true, message: 'Användaren har tagits bort.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.get('/api/me', requireSiteAccess, requireUserAuth, (req, res) => {
    res.json({ success: true, user: (req as any).user });
  });

  app.post('/api/logout', (req, res) => {
    res.clearCookie('user_session_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ success: true });
  });

  app.post('/api/site-logout', (req, res) => {
    res.clearCookie('site_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.clearCookie('user_session_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ success: true });
  });

  // ── Adventures CRUD Endpoints ────────────────────────────────────
  app.get('/api/adventures', requireSiteAccess, async (req, res) => {
    try {
      const adventures = await queryAll('SELECT * FROM adventures ORDER BY date ASC, time ASC');
      res.json({ success: true, adventures });
    } catch (error) {
      console.error('Error fetching adventures:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.post('/api/adventures', requireSiteAccess, requireUserAuth, requireSuperAdmin, async (req, res) => {

    const { title, date, time, language, dm, maxPlayers, spotsLeft, location, interestUrl, imageUrl } = req.body;
    if (!title || !date || !time || !language || !dm || maxPlayers === undefined || spotsLeft === undefined || !location || !interestUrl) {
      return res.status(400).json({ success: false, message: 'Alla fält måste fyllas i.' });
    }

    try {
      // Slugify title and append timestamp to guarantee uniqueness
      const baseSlug = title.toLowerCase()
        .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const id = `${baseSlug || 'adventure'}-${Date.now()}`;
      const feedbackUrl = `/feedback?adventure=${id}`;

      await execute(`
        INSERT INTO adventures (id, title, date, time, language, dm, maxPlayers, spotsLeft, location, interestUrl, feedbackUrl, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, title, date, time, language, dm, Number(maxPlayers), Number(spotsLeft), location, interestUrl, feedbackUrl, imageUrl || null]);

      res.json({ success: true, message: 'Äventyret har skapats.' });
    } catch (error) {
      console.error('Error creating adventure:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.put('/api/adventures/:id', requireSiteAccess, requireUserAuth, requireSuperAdmin, async (req, res) => {

    const { id } = req.params;
    const { title, date, time, language, dm, maxPlayers, spotsLeft, location, interestUrl, imageUrl } = req.body;

    if (!title || !date || !time || !language || !dm || maxPlayers === undefined || spotsLeft === undefined || !location || !interestUrl) {
      return res.status(400).json({ success: false, message: 'Alla fält måste fyllas i.' });
    }

    try {
      const existing = await queryOne('SELECT * FROM adventures WHERE id = ?', [id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Äventyret hittades inte.' });
      }

      await execute(`
        UPDATE adventures
        SET title = ?, date = ?, time = ?, language = ?, dm = ?, maxPlayers = ?, spotsLeft = ?, location = ?, interestUrl = ?, imageUrl = ?
        WHERE id = ?
      `, [title, date, time, language, dm, Number(maxPlayers), Number(spotsLeft), location, interestUrl, imageUrl !== undefined ? imageUrl : existing.imageUrl, id]);

      res.json({ success: true, message: 'Äventyret har uppdaterats.' });
    } catch (error) {
      console.error('Error updating adventure:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  // ── Image Upload Endpoint ─────────────────────────────────────────
  app.post('/api/upload-image', requireSiteAccess, requireUserAuth, requireSuperAdmin, (req, res) => {

    const { base64Image, fileName } = req.body;
    if (!base64Image) {
      return res.status(400).json({ success: false, message: 'Ingen bild skickad.' });
    }

    try {
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, message: 'Ogiltigt bildformat.' });
      }

      const imageBuffer = Buffer.from(matches[2], 'base64');
      const ext = fileName ? path.extname(fileName) : '.png';
      const cleanFileName = `img-${Date.now()}${ext}`;
      const filePath = path.join(UPLOADS_DIR, cleanFileName);

      fs.writeFileSync(filePath, imageBuffer);

      res.json({ success: true, url: `/uploads/${cleanFileName}` });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ success: false, message: 'Det gick inte att spara bilden.' });
    }
  });

  app.delete('/api/adventures/:id', requireSiteAccess, requireUserAuth, requireSuperAdmin, async (req, res) => {

    const { id } = req.params;

    try {
      const existing = await queryOne('SELECT * FROM adventures WHERE id = ?', [id]);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Äventyret hittades inte.' });
      }

      await execute('DELETE FROM adventures WHERE id = ?', [id]);
      res.json({ success: true, message: 'Äventyret har tagits bort.' });
    } catch (error) {
      console.error('Error deleting adventure:', error);
      res.status(500).json({ success: false, message: 'Internt serverfel.' });
    }
  });

  app.get('/api/auth-status', (req, res) => {
    const siteToken = req.cookies.site_access_token;
    const userToken = req.cookies.user_session_token;

    let hasSiteAccess = false;
    let user = null;

    if (siteToken) {
      try {
        jwt.verify(siteToken, JWT_SECRET);
        hasSiteAccess = true;
      } catch (e) { }
    }

    if (hasSiteAccess && userToken) {
      try {
        const decoded = jwt.verify(userToken, JWT_SECRET) as any;
        if (decoded && typeof decoded === 'object') {
          decoded.isSuperAdmin = decoded.isSuperAdmin !== undefined ? decoded.isSuperAdmin : isSuperAdmin(decoded.username);
        }
        user = decoded;
      } catch (e) { }
    }

    res.json({ success: true, hasSiteAccess, user });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
