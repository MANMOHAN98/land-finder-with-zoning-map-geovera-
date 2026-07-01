import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  deleteDoc 
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Seeding standard Indian premium lands when database is empty
const SEED_LISTINGS = [
  {
    id: "seed-1",
    title: "Fertile irrigated sugarcane farmland",
    location: "Baramati, Pune District, Maharashtra",
    areaName: "Baramati",
    county: "Pune District",
    price: 36000000,
    acres: 4.5,
    zoning: "AGRI",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-green-wheat-fields-41624-large.mp4",
    description: "Multi-harvest highly fertile heavy organic soil farmland. Served by Nira Canal lift irrigation system, active 3-Phase agricultural feeder lines. Includes 40 high-yield Mango and Coconut trees.",
    coordinates: { lat: 18.15, lng: 74.58 },
    parcelPolygon: [[20, 20], [35, 20], [35, 35], [20, 35]],
    agentId: "agent_sarah",
    agentName: "Saravanan Jayaram",
    agentPhone: "98451 09321",
    agentEmail: "s.jayaram@indiacadasters.in",
    landType: "Wet Agricultural",
    soilType: "Black Cotton Loam",
    landColor: "Deep Dark Black",
    cropsSuggested: "Sugarcane, Organic Bananas, Turmeric, Ginger",
    existingPlants: "80 Coconut Palms, 25 Alphonso Mangoes",
    surveyNumber: "381/2-A",
    ownerName: "Abasaheb Patil",
    treesCount: "105 total",
    state: "Maharashtra",
    district: "Pune",
    taluk: "Baramati",
    village: "Supe",
    waterSource: "River lift schema + 2 borewells",
    electricity: "Continuous 3-Phase agricultural line",
    roadAccess: "State Hwy direct tar connection",
    hasSoilTest: true,
    hasSurvey: true,
    hub: "INDIA",
    isUserAdded: false
  },
  {
    id: "seed-2",
    title: "Premium commercial logistics yard plot",
    location: "Chakan Industrial Zone, Pune, Maharashtra",
    areaName: "Chakan Zone 26",
    county: "Pune District",
    price: 185000000,
    acres: 2.2,
    zoning: "IND",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-over-green-wheat-fields-41624-large.mp4",
    description: "Fully industrial converted logistics-ready lot. Corner plot with extreme road frontage (24 meters wide). Ready for heavy warehouse construction, e-commerce dispatch hubs or processing plants.",
    coordinates: { lat: 18.75, lng: 73.85 },
    parcelPolygon: [[50, 10], [70, 10], [70, 25], [50, 25]],
    agentId: "agent_marcus",
    agentName: "Mahendra Singh",
    agentPhone: "94215 88321",
    agentEmail: "m.singh@apexland.in",
    landType: "Industrial Logistics Use Land",
    soilType: "Murrum / Red Gravelly Soil",
    landColor: "Grey Rocky Hard base",
    cropsSuggested: "Not applicable (Industrial Use)",
    existingPlants: "None",
    surveyNumber: "144-B/6",
    ownerName: "Singh Logistics Ltd",
    treesCount: "None",
    state: "Maharashtra",
    district: "Pune",
    taluk: "Khed",
    village: "Chakan",
    waterSource: "MIDC Industrial water connection pipe",
    electricity: "11KV High Tension industrial lines",
    roadAccess: "4-lane MDR cement road",
    hasSoilTest: true,
    hasSurvey: true,
    hub: "INDIA",
    isUserAdded: false
  }
];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'lands-finder-super-secret-key-12345!';

  app.use(express.json());

  // Helper to remove any undefined properties recursively to prevent Firestore errors
  const cleanUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanUndefined);
    }
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        cleaned[key] = cleanUndefined(obj[key]);
      }
    }
    return cleaned;
  };

  // Helper to map nested arrays to array of objects for Firestore compatibility (since Firestore does not support nested arrays)
  const toDBListing = (item: any) => {
    const outbound = { ...item };
    if (Array.isArray(outbound.parcelPolygon)) {
      outbound.parcelPolygon = outbound.parcelPolygon.map((pt: any) => {
        if (Array.isArray(pt)) {
          return { x: pt[0], y: pt[1] };
        }
        return pt;
      });
    }
    return cleanUndefined(outbound);
  };

  const fromDBListing = (item: any) => {
    const inbound = { ...item };
    if (Array.isArray(inbound.parcelPolygon)) {
      inbound.parcelPolygon = inbound.parcelPolygon.map((pt: any) => {
        if (pt && typeof pt === 'object' && 'x' in pt && 'y' in pt) {
          return [pt.x, pt.y];
        }
        return pt;
      });
    }
    return inbound;
  };

  // Initialize Firebase with auto-loaded client-side workspace configuration
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  let db: any;

  const logActivity = async (
    action: string,
    user: any,
    status: 'success' | 'failed' = 'success',
    additional: any = {}
  ) => {
    try {
      if (!db) return;
      const nowStr = new Date().toISOString();
      const logId = `LOG-${Math.floor(Math.random() * 900000) + 100000}`;
      const logPayload = {
        id: logId,
        userId: user?.id || 'guest',
        name: user?.name || 'Guest / Unauthenticated',
        email: user?.email || additional?.email || 'N/A',
        role: user?.role || 'visitor',
        timestamp: nowStr,
        loginTime: nowStr,
        passwordSecure: '••••••••',
        method: additional?.method || 'API_ACTION',
        status: status,
        userAgent: additional?.userAgent || 'Gov Agent Terminal Node',
        action: action,
        ...additional
      };
      await setDoc(doc(db, 'logs', logId), cleanUndefined(logPayload));
      console.log(`📝 logged activity: ${action} for ${logPayload.email}`);
    } catch (err) {
      console.error('Failed to write activity log:', err);
    }
  };

  try {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(configData);
    const dbId = configData.firestoreDatabaseId;
    if (dbId && dbId !== '(default)') {
      db = getFirestore(firebaseApp, dbId);
      console.log(`🔥 Successfully attached Firebase Firestore named database ID: ${dbId}`);
    } else {
      db = getFirestore(firebaseApp);
      console.log(`🔥 Successfully attached Firebase Firestore (default) database`);
    }
    
    // Seed initial properties if db is blank
    let seedSnapshot;
    try {
      seedSnapshot = await getDocs(collection(db, "listings"));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, "listings");
      return;
    }

    if (seedSnapshot.empty) {
      console.log("🌱 No prior listings registry detected. Bootstrapping high-yield seed plots...");
      for (const item of SEED_LISTINGS) {
        try {
          await setDoc(doc(db, "listings", item.id), toDBListing(item));
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `listings/${item.id}`);
        }
      }
    }

    // Purge residual demo, trial, or placeholder sandbox profiles from the users collection
    const demoEmails = [
      's.jayaram@indiacadasters.in',
      'm.singh@apexland.in',
      'buyer.trial@indiacadasters.gov.in',
      'auth.google@indiacadasters.gov.in',
      'auth.github@indiacadasters.gov.in',
      'john.miller@ruralinterests.net',
      'clara.design.build@gmail.com'
    ];
    for (const email of demoEmails) {
      try {
        const docRef = doc(db, 'users', email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(`🧹 Scraping demo account from database: ${email}`);
          await deleteDoc(docRef);
        }
      } catch (err: any) {
        console.warn(`Could not delete demo account ${email}:`, err.message);
      }
    }

    // Seed secure deployer admin account if nonexistent
    const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
    const adminRef = doc(db, 'users', deployerEmail);
    const adminDoc = await getDoc(adminRef);
    const hashedAdminPassword = await bcrypt.hash('manmohan', 10);
    if (!adminDoc.exists()) {
      console.log(`🛡️ Bootstrapping deployer admin account: ${deployerEmail}`);
      await setDoc(adminRef, {
        id: "admin_root",
        name: "National Admin (Deployer)",
        email: deployerEmail,
        password: hashedAdminPassword,
        role: "admin",
        isEmailVerified: true,
        isVerifiedAgent: false,
        createdAt: new Date().toISOString()
      });
    } else {
      console.log(`🛡️ Refreshing deployer admin password to 'manmohan'`);
      await updateDoc(adminRef, {
        password: hashedAdminPassword,
        role: "admin"
      });
    }
  } catch (err) {
    console.error("❌ Fatal workspace database initialization exception:", err);
  }

  // Helper auth middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Null session token error. Authentication required.' });

    jwt.verify(token, JWT_SECRET, (err: any, tokenData: any) => {
      if (err) return res.status(403).json({ error: 'Session token has expired or is invalid.' });
      req.user = tokenData;
      next();
    });
  };

  // ----------------------------------------------------
  // REGISTER USER ENDPOINT
  // ----------------------------------------------------
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name, role, agencyName, licenseNumber, agentPhone } = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Please complete all required fields.' });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Check duplicate
      const userRef = doc(db, 'users', cleanEmail);
      let userDoc;
      try {
        userDoc = await getDoc(userRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${cleanEmail}`);
      }

      if (userDoc && userDoc.exists()) {
        return res.status(409).json({ error: 'Account already exists: This email is already registered.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = "VERIFIED_HYBRID";

      let newUserProfile: any = {};

      if (role === 'buyer') {
        // Buyer Profile containing strictly requested fields + system essentials for registration/login
        newUserProfile = {
          id: `user_${Math.random().toString(36).substring(2, 9)}`,
          name: name, // UI compatibility
          fullName: name, // Required field
          email: cleanEmail, // Required field
          phone: agentPhone || '', // Required field
          agentPhone: agentPhone || '', // UI compatibility
          password: hashedPassword, // Auth compatibility
          role: role, // Required field
          isEmailVerified: true, // Auth compatibility
          verificationCode: verificationCode, // Auth compatibility
          isVerifiedAgent: false,
          createdAt: new Date().toISOString(), // Required field
          lastLogin: new Date().toISOString() // Required field
        };
      } else {
        // Seller Profile (role === 'agent') containing standard systems plus potential agencyName
        newUserProfile = {
          id: `user_${Math.random().toString(36).substring(2, 9)}`,
          name: name,
          fullName: name,
          email: cleanEmail,
          password: hashedPassword,
          role: role,
          isVerifiedAgent: true,
          phone: agentPhone || '',
          agentPhone: agentPhone || '',
          verificationCode,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        if (agencyName && agencyName.trim() !== '') {
          newUserProfile.agencyName = agencyName.trim();
        }
        if (licenseNumber && licenseNumber.trim() !== '') {
          newUserProfile.licenseNumber = licenseNumber.trim();
        }
      }

      // Run deep clean to remove any undefined values to satisfy Firestore Constraints and Validation Requirement
      const cleanedUserProfile = cleanUndefined(newUserProfile);

      // Store in firestore
      try {
        await setDoc(userRef, cleanedUserProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${cleanEmail}`);
      }

      // Generate JWT
      const token = jwt.sign(
        { email: cleanEmail, id: newUserProfile.id, role: role, isDeployer: false }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // Log Registration Action
      await logActivity('User Registration', newUserProfile, 'success', { method: 'CREDENTIALS' });
      await logActivity('User Login', newUserProfile, 'success', { method: 'CREDENTIALS' });

      // Return public sanitised profile plus token for direct auto-login
      const { password: _, ...securedProfile } = newUserProfile;
      res.status(201).json({
        message: 'Successfully registered and logged in!',
        token,
        profile: securedProfile
      });

    } catch (err: any) {
      console.error("Register Error:", err);
      res.status(500).json({ error: 'Unable to create account. Please try again.' });
    }
  });

  // ----------------------------------------------------
  // GOOGLE SIGN-IN / AUTHENTICATION CHECK
  // ----------------------------------------------------
  app.post('/api/auth/google-auth', async (req, res) => {
    try {
      const { email, name, uid } = req.body;
      if (!email || !uid) {
        return res.status(400).json({ error: 'Google authentication details missing.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      const isDeployerMail = cleanEmail === deployerEmail;

      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if user account is disabled
        if (userData.isDisabled) {
          return res.status(403).json({ error: 'Your account has been temporarily suspended.' });
        }

        // Generate JWT
        const assignedRole = isDeployerMail ? 'admin' : userData.role;
        const maskedEmail = isDeployerMail ? 'admin@indiacadasters.gov.in' : cleanEmail;

        const token = jwt.sign(
          { email: maskedEmail, id: userData.id, role: assignedRole, isDeployer: isDeployerMail }, 
          JWT_SECRET, 
          { expiresIn: '7d' }
        );

        // Log Login Action
        await logActivity('User Login', userData, 'success', { method: 'GOOGLE', userAgent: req.headers['user-agent'] });

        return res.status(200).json({
          exists: true,
          token,
          profile: {
            id: userData.id,
            name: isDeployerMail ? 'National Admin (Deployer)' : userData.name,
            email: maskedEmail,
            role: assignedRole,
            isVerifiedAgent: isDeployerMail ? true : userData.isVerifiedAgent,
            agencyName: userData.agencyName,
            licenseNumber: userData.licenseNumber,
            agentPhone: userData.agentPhone
          }
        });
      } else {
        // New user - needs role selection
        return res.status(200).json({
          exists: false,
          email: cleanEmail,
          name: name || email.split('@')[0]
        });
      }
    } catch (err: any) {
      console.error("Google Auth Exception Error:", err);
      res.status(500).json({ error: `Google auth error: ${err.message}` });
    }
  });

  // ----------------------------------------------------
  // GOOGLE REGISTRATION (ROLE PERSISTENCE)
  // ----------------------------------------------------
  app.post('/api/auth/google-register', async (req, res) => {
    try {
      const { email, name, uid, role, phone } = req.body;
      if (!email || !role || !uid) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return res.status(409).json({ error: 'Account already exists for this email.' });
      }

      let newUserProfile: any = {};
      const generatedId = `user_${Math.random().toString(36).substring(2, 9)}`;

      if (role === 'buyer') {
        newUserProfile = {
          id: generatedId,
          name: name,
          fullName: name,
          email: cleanEmail,
          phone: phone || '',
          agentPhone: phone || '',
          role: role,
          isEmailVerified: true, // Google accounts are verified
          isVerifiedAgent: false,
          googleUid: uid,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else {
        newUserProfile = {
          id: generatedId,
          name: name,
          fullName: name,
          email: cleanEmail,
          role: role, // 'agent' role
          isVerifiedAgent: true,
          phone: phone || '',
          agentPhone: phone || '',
          isEmailVerified: true,
          googleUid: uid,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }

      const cleanedUserProfile = cleanUndefined(newUserProfile);
      await setDoc(userRef, cleanedUserProfile);

      // Generate JWT
      const token = jwt.sign(
        { email: cleanEmail, id: generatedId, role: role, isDeployer: false },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log Registration Action
      await logActivity('User Registration', newUserProfile, 'success', { method: 'GOOGLE' });
      await logActivity('User Login', newUserProfile, 'success', { method: 'GOOGLE' });

      res.status(201).json({
        message: 'Successfully registered and logged in with Google!',
        token,
        profile: {
          id: newUserProfile.id,
          name: newUserProfile.name,
          email: cleanEmail,
          role: role,
          isVerifiedAgent: newUserProfile.isVerifiedAgent,
          agentPhone: newUserProfile.agentPhone
        }
      });
    } catch (err: any) {
      console.error("Google Register Error:", err);
      res.status(500).json({ error: 'Unable to create account with Google. Please try again.' });
    }
  });

  // ----------------------------------------------------
  // VERIFY EMAIL ENDPOINT
  // ----------------------------------------------------
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'Validation code and register email are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ error: 'Registration record not found.' });
      }

      const userData = userDoc.data();
      if (userData.verificationCode !== code.trim()) {
        return res.status(400).json({ error: 'Incorrect verification code. Please check code or request a resend.' });
      }

      // Complete validation
      await updateDoc(userRef, {
        isEmailVerified: true,
        verificationCode: ""
      });

      // Generate JWT Session Token
      const token = jwt.sign({ email: cleanEmail, id: userData.id, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });

      const verifiedProfile = {
        id: userData.id,
        name: userData.name,
        email: cleanEmail,
        role: userData.role,
        isVerifiedAgent: userData.isVerifiedAgent,
        agencyName: userData.agencyName,
        licenseNumber: userData.licenseNumber,
        agentPhone: userData.agentPhone
      };

      // Log Login on verification success
      await logActivity('User Login', userData, 'success', { method: 'EMAIL_VERIFICATION' });

      res.status(200).json({
        message: 'Account verified successfully!',
        token,
        profile: verifiedProfile
      });

    } catch (err: any) {
      console.error("Verification Error:", err);
      res.status(500).json({ error: 'Server authentication verification error.' });
    }
  });

  // ----------------------------------------------------
  // FORGOT PASSWORD PROCESS ENDPOINT
  // ----------------------------------------------------
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ error: 'Email not registered. No match found in the Cadaster central registry.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await updateDoc(userRef, { resetToken: otp });

      res.status(200).json({
        message: 'Password reset OTP generated successfully!',
        devResetCode: otp // Outputting for sandbox mock email/banner notification display
      });

    } catch (err: any) {
      console.error("Forgot Pass Error:", err);
      res.status(500).json({ error: 'Server forgot-password lookup error.' });
    }
  });

  // ----------------------------------------------------
  // RESET PASSWORD ACTION ENDPOINT
  // ----------------------------------------------------
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Email, code, and new secure password are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ error: 'Email not registered.' });
      }

      const userData = userDoc.data();
      if (userData.resetToken !== code.trim()) {
        return res.status(400).json({ error: 'Invalid or expired OTP reset credentials.' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await updateDoc(userRef, {
        password: hashedNewPassword,
        resetToken: "",
        isEmailVerified: true // Set checked verified automatically
      });

      res.status(200).json({ message: 'Password restored successfully! Please log in.' });

    } catch (err: any) {
      console.error("Reset Password Error:", err);
      res.status(500).json({ error: 'Server reset password failure.' });
    }
  });

  // ----------------------------------------------------
  // BACKEND LOGIN ENDPOINT
  // ----------------------------------------------------
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Credentials missing: Email and password are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      const isDeployerMail = cleanEmail === deployerEmail;

      // Check deployer bypass or standard check
      const userRef = doc(db, 'users', cleanEmail);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(401).json({ error: 'Email not registered. Sign up to create an account first.' });
      }

      const userData = userDoc.data();

      // Check if user account is disabled
      if (userData.isDisabled) {
        return res.status(403).json({ error: 'Your account has been temporarily suspended.' });
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      if (!isPasswordCorrect) {
        await logActivity('User Login', null, 'failed', { email: cleanEmail, method: 'CREDENTIALS', userAgent: req.headers['user-agent'] });
        return res.status(401).json({ error: 'Invalid password. Enter licensed login credentials.' });
      }

      // Check if email verified. If not, can return a special status for client to proceed verification
      if (!userData.isEmailVerified) {
        const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
        await updateDoc(userRef, { verificationCode: freshCode });
        return res.status(403).json({
          error: 'Unverified email address. Complete verification.',
          requiresVerification: true,
          email: cleanEmail,
          devVerificationCode: freshCode
        });
      }

      // Generate JWT
      // Make sure deployer is mapped to 'admin' role, and mask their email
      const assignedRole = isDeployerMail ? 'admin' : userData.role;
      const maskedEmail = isDeployerMail ? 'admin@indiacadasters.gov.in' : cleanEmail;

      const token = jwt.sign(
        { email: maskedEmail, id: userData.id, role: assignedRole, isDeployer: isDeployerMail }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // Log successful login
      await logActivity('User Login', userData, 'success', { method: 'CREDENTIALS', userAgent: req.headers['user-agent'] });

      res.status(200).json({
        message: 'Successfully logged in!',
        token,
        profile: {
          id: userData.id,
          name: isDeployerMail ? 'National Admin (Deployer)' : userData.name,
          email: maskedEmail, // Frontend never receives actual deployer email
          role: assignedRole,
          isVerifiedAgent: isDeployerMail ? true : userData.isVerifiedAgent,
          agencyName: userData.agencyName,
          licenseNumber: userData.licenseNumber,
          agentPhone: userData.agentPhone
        }
      });

    } catch (err: any) {
      console.error("Login Exception Error:", err);
      res.status(500).json({ error: `Server login exception: ${err.message}` });
    }
  });

  // ----------------------------------------------------
  // AUTOLOGIN /SESSION VALIDATION ENDPOINT
  // ----------------------------------------------------
  app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    try {
      const email = req.user.email || '';
      const isDeployerMail = req.user.isDeployer === true || email.toLowerCase().trim() === 'admin@indiacadasters.gov.in';
      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();

      const lookupEmail = isDeployerMail ? deployerEmail : email;
      const userRef = doc(db, 'users', lookupEmail);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ error: 'Profile not found.' });
      }

      const userData = userDoc.data();

      // Check if user account is disabled
      if (userData.isDisabled) {
        return res.status(403).json({ error: 'Your account has been temporarily suspended.' });
      }

      const maskedEmail = isDeployerMail ? 'admin@indiacadasters.gov.in' : userData.email;
      const assignedRole = isDeployerMail ? 'admin' : userData.role;

      res.status(200).json({
        profile: {
          id: userData.id,
          name: isDeployerMail ? 'National Admin (Deployer)' : userData.name,
          email: maskedEmail, // Frontend never receives actual deployer email
          role: assignedRole,
          isVerifiedAgent: isDeployerMail ? true : userData.isVerifiedAgent,
          agencyName: userData.agencyName,
          licenseNumber: userData.licenseNumber,
          agentPhone: userData.agentPhone
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Server authentication verification error.' });
    }
  });

  // ----------------------------------------------------
  // SECURE ROLE-BASED ACCESS CONTROL MIDDLEWARE & ENDPOINTS
  // ----------------------------------------------------
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'deployer')) {
      return res.status(403).json({ error: 'Access Denied: Administration authority required.' });
    }
    next();
  };

  // Secure API to fetch all user accounts under Administration
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: any[] = [];
      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      
      snap.forEach((d) => {
        const u = d.data();
        const isDeployerMail = u.email && u.email.toLowerCase().trim() === deployerEmail;
        list.push({
          id: u.id,
          name: isDeployerMail ? 'National Admin (Deployer)' : (u.name || u.fullName || ''),
          email: isDeployerMail ? 'admin@indiacadasters.gov.in' : u.email,
          role: isDeployerMail ? 'admin' : u.role,
          isVerifiedAgent: isDeployerMail ? true : (u.isVerifiedAgent || false),
          agencyName: u.agencyName || '',
          licenseNumber: u.licenseNumber || '',
          agentPhone: u.agentPhone || u.phone || '',
          createdAt: u.createdAt || '',
          lastLogin: u.lastLogin || '',
          isDisabled: u.isDisabled || false
        });
      });
      res.status(200).json(list);
    } catch (err: any) {
      res.status(500).json({ error: `Fetch users failed: ${err.message}` });
    }
  });

  // Secure API to edit user details (Name, Email, Role)
  app.put('/api/admin/users/:userId', authenticateToken, requireAdmin, async (req: any, res: any) => {
    try {
      const { name, email, role } = req.body;
      const { userId } = req.params;
      
      const snap = await getDocs(collection(db, 'users'));
      let targetEmail: string | null = null;
      let existingUser: any = null;
      snap.forEach((d) => {
        if (d.data().id === userId) {
          targetEmail = d.id;
          existingUser = d.data();
        }
      });

      if (!targetEmail || !existingUser) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      if (targetEmail.toLowerCase().trim() === deployerEmail) {
        return res.status(403).json({ error: 'Cannot edit system deployer admin node.' });
      }

      const cleanNewEmail = email ? email.toLowerCase().trim() : targetEmail;
      
      if (cleanNewEmail !== targetEmail) {
        const userRefNew = doc(db, 'users', cleanNewEmail);
        const doubleCheck = await getDoc(userRefNew);
        if (doubleCheck.exists()) {
          return res.status(409).json({ error: 'New email address already assigned to another user.' });
        }
        
        const updatedProfile = {
          ...existingUser,
          name: name || existingUser.name,
          email: cleanNewEmail,
          role: role || existingUser.role
        };
        await setDoc(userRefNew, cleanUndefined(updatedProfile));
        await deleteDoc(doc(db, 'users', targetEmail));
        
        // Log this edit action in audit logs
        await logActivity('Admin Actions', req.user, 'success', {
          method: 'ADMIN_EDIT_USER_EMAIL',
          userAgent: `Updated User ID: ${userId} - Old Email: ${targetEmail}, New Email: ${cleanNewEmail}, New Name: ${name}, New Role: ${role}`
        });
      } else {
        await updateDoc(doc(db, 'users', targetEmail), {
          name: name || existingUser.name,
          role: role || existingUser.role
        });

        await logActivity('Admin Actions', req.user, 'success', {
          method: 'ADMIN_EDIT_USER_INFO',
          userAgent: `Updated User Email: ${targetEmail} - Name: ${name}, Role: ${role}`
        });
      }

      res.status(200).json({ message: 'User updated successfully!' });
    } catch (err: any) {
      res.status(500).json({ error: `Update user failed: ${err.message}` });
    }
  });

  // Secure API to toggle disabled status
  app.put('/api/admin/users/:userId/status', authenticateToken, requireAdmin, async (req: any, res: any) => {
    try {
      const { isDisabled } = req.body;
      const { userId } = req.params;
      
      const snap = await getDocs(collection(db, 'users'));
      let targetEmail: string | null = null;
      let existingUser: any = null;
      snap.forEach((d) => {
        if (d.data().id === userId) {
          targetEmail = d.id;
          existingUser = d.data();
        }
      });

      if (!targetEmail || !existingUser) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      if (targetEmail.toLowerCase().trim() === deployerEmail) {
        return res.status(403).json({ error: 'Cannot disable the system admin.' });
      }

      const userRef = doc(db, 'users', targetEmail);
      await updateDoc(userRef, { isDisabled: !(!isDisabled) });

      // Log this action:
      await logActivity(
        isDisabled ? 'User Disable' : 'Admin Actions',
        req.user,
        'success',
        {
          method: isDisabled ? 'ADMIN_DISABLE_USER' : 'ADMIN_ENABLE_USER',
          userAgent: `${isDisabled ? 'Disabled' : 'Enabled'} User: ${targetEmail}`
        }
      );

      res.status(200).json({ message: 'User status updated successfully!' });
    } catch (err: any) {
      res.status(500).json({ error: `Toggle user status failed: ${err.message}` });
    }
  });

  // Secure API to update legacy role status
  app.put('/api/admin/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { role, isVerifiedAgent } = req.body;
      const { userId } = req.params;
      
      const snap = await getDocs(collection(db, 'users'));
      let targetEmail: string | null = null;
      snap.forEach((d) => {
        if (d.data().id === userId) {
          targetEmail = d.id;
        }
      });

      if (!targetEmail) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      if (targetEmail.toLowerCase().trim() === deployerEmail) {
        return res.status(403).json({ error: 'Constraint violated: Cannot modify system deploer node.' });
      }

      const userRef = doc(db, 'users', targetEmail);
      await updateDoc(userRef, { role, isVerifiedAgent: !!isVerifiedAgent });
      res.status(200).json({ message: 'User role updated successfully!' });
    } catch (err: any) {
      res.status(500).json({ error: `Update user failed: ${err.message}` });
    }
  });

  // Secure API to delete users with exhaustive cleanup
  app.delete('/api/admin/users/:userId', authenticateToken, requireAdmin, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      
      const snap = await getDocs(collection(db, 'users'));
      let targetEmail: string | null = null;
      let existingUser: any = null;
      snap.forEach((d) => {
        if (d.data().id === userId) {
          targetEmail = d.id;
          existingUser = d.data();
        }
      });

      if (!targetEmail || !existingUser) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      const deployerEmail = (process.env.DEPLOYER_EMAIL || "manmohanmanu98@gmail.com").toLowerCase().trim();
      if (targetEmail.toLowerCase().trim() === deployerEmail) {
        return res.status(403).json({ error: 'Constraint violated: Cannot delete system deployer node.' });
      }

      // Delete User Profile doc
      await deleteDoc(doc(db, 'users', targetEmail));

      const userRole = existingUser.role || 'buyer';
      const userEmail = targetEmail;

      // Clean up listings associated with this seller
      const listingsSnap = await getDocs(collection(db, 'listings'));
      for (const listingDoc of listingsSnap.docs) {
        const item = listingDoc.data();
        if (item.agentId === userId || item.agentEmail === userEmail) {
          await deleteDoc(doc(db, 'listings', listingDoc.id));
          console.log(`🧹 Deleted listing ${listingDoc.id} associated with deleted user ${userEmail}`);
        }
      }

      // Clean up messages associated with this user
      const msgsSnap = await getDocs(collection(db, 'messages'));
      for (const msgDoc of msgsSnap.docs) {
        const item = msgDoc.data();
        if (item.buyerId === userId || item.agentId === userId || item.buyerEmail === userEmail || item.agentEmail === userEmail) {
          await deleteDoc(doc(db, 'messages', msgDoc.id));
          console.log(`🧹 Deleted message ${msgDoc.id} associated with deleted user ${userEmail}`);
        }
      }

      // Log this deletion action for audits
      await logActivity('User Delete', req.user, 'success', {
        deletedUserId: userId,
        method: 'ADMIN_DELETE_USER',
        userAgent: `Deleted User Name: ${existingUser.name || ''}, Email: ${userEmail}, Role: ${userRole}`
      });

      res.status(200).json({ message: 'User permanently deleted.' });
    } catch (err: any) {
      res.status(500).json({ error: `Delete user failed: ${err.message}` });
    }
  });

  // Secure API to update listing status (approve or reject)
  app.put('/api/admin/listings/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid listing status value.' });
      }

      const listingRef = doc(db, 'listings', id);
      const listingDoc = await getDoc(listingRef);
      if (!listingDoc.exists()) {
        return res.status(404).json({ error: 'Listing not found.' });
      }

      await updateDoc(listingRef, { status });

      // Log this admin action
      await logActivity('Admin Actions', (req as any).user, 'success', {
        method: 'ADMIN_VERIFY_LAND',
        userAgent: `Listing status updated to ${status} for ID ${id}`,
        landId: id,
        status: status
      });

      res.status(200).json({ message: `Listing status updated to ${status}` });
    } catch (err: any) {
      res.status(500).json({ error: `Update status failed: ${err.message}` });
    }
  });

  // ----------------------------------------------------
  // LAND LISTINGS ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/listings', authenticateToken, async (req, res) => {
    try {
      const snap = await getDocs(collection(db, 'listings'));
      let items: any[] = [];
      snap.forEach(docSnap => {
        const item = fromDBListing({ id: docSnap.id, ...docSnap.data() });
        // Only return approved listings to buyers or query results
        if (req.query.searchFirst === 'true') {
          if (item.status === 'approved') {
            items.push(item);
          }
        } else {
          items.push(item);
        }
      });

      const { q, state, district, taluk, village, landType, zoning } = req.query;

      // If the buyer is requesting but has no active search terms, return an empty array
      if (req.query.searchFirst === 'true' && !q && !state && !district && !taluk && !village && !landType && !zoning) {
        return res.json([]);
      }

      const normalizeStr = (val: any): string => {
        if (val === undefined || val === null) return '';
        return String(val).trim().toLowerCase().replace(/\s+/g, ' ');
      };

      if (q) {
        const queryStr = normalizeStr(q);
        items = items.filter(item => {
          if (!queryStr) return true;
          return (
            normalizeStr(item.state).includes(queryStr) ||
            normalizeStr(item.district).includes(queryStr) ||
            normalizeStr(item.taluk).includes(queryStr) ||
            normalizeStr(item.village).includes(queryStr) ||
            normalizeStr(item.areaName).includes(queryStr) ||
            normalizeStr(item.surveyNumber).includes(queryStr) ||
            normalizeStr(item.title).includes(queryStr) ||
            normalizeStr(item.landType).includes(queryStr) ||
            normalizeStr(item.ownerName).includes(queryStr) ||
            normalizeStr(item.location).includes(queryStr) ||
            normalizeStr(item.pincode).includes(queryStr) ||
            normalizeStr(item.description).includes(queryStr) ||
            normalizeStr(item.county).includes(queryStr)
          );
        });
      }
      if (state && state !== 'ALL') {
        const stateStr = normalizeStr(state);
        items = items.filter(item => normalizeStr(item.state).includes(stateStr) || normalizeStr(item.location).includes(stateStr));
      }
      if (district && district !== 'ALL') {
        const distStr = normalizeStr(district);
        items = items.filter(item => normalizeStr(item.district).includes(distStr) || normalizeStr(item.location).includes(distStr));
      }
      if (taluk && taluk !== 'ALL') {
        const talukStr = normalizeStr(taluk);
        items = items.filter(item => normalizeStr(item.taluk).includes(talukStr) || normalizeStr(item.location).includes(talukStr));
      }
      if (village && village !== 'ALL') {
        const vilStr = normalizeStr(village);
        items = items.filter(item => normalizeStr(item.village).includes(vilStr) || normalizeStr(item.areaName).includes(vilStr) || normalizeStr(item.location).includes(vilStr));
      }
      if (landType && landType !== 'ALL') {
        items = items.filter(item => item.landType === landType);
      }
      if (zoning && zoning !== 'ALL') {
        items = items.filter(item => item.zoning === zoning);
      }

      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: `Fetch listings error: ${err.message}` });
    }
  });

  app.post('/api/listings', authenticateToken, async (req, res) => {
    try {
      const item = req.body;
      if (!item.id || !item.title) {
        return res.status(400).json({ error: 'Incomplete land data payload.' });
      }
      await setDoc(doc(db, 'listings', item.id), toDBListing(item));
      
      // Log Land Registration
      await logActivity('Land Registration', (req as any).user, 'success', { title: item.title, landId: item.id });

      res.status(201).json({ message: 'Land registry listed successfully.', item });
    } catch (err: any) {
      res.status(500).json({ error: `Could not list land parcel: ${err.message}` });
    }
  });

  app.put('/api/listings/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const docRef = doc(db, 'listings', id);
      const docExist = await getDoc(docRef);

      if (!docExist.exists()) {
        return res.status(404).json({ error: 'Land parcel was not found.' });
      }

      await updateDoc(docRef, toDBListing(updatedData));

      // Log Land Update
      await logActivity('Land Update', (req as any).user, 'success', { title: updatedData.title, landId: id });

      res.json({ message: 'Land registry updated successfully.', id });
    } catch (err: any) {
      res.status(500).json({ error: `Update listing failure: ${err.message}` });
    }
  });

  app.delete('/api/listings/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await deleteDoc(doc(db, 'listings', id));

      // Log Land Delete
      await logActivity('Land Delete', (req as any).user, 'success', { landId: id });

      res.json({ message: 'Land parcel revoked and deleted successfully.', id });
    } catch (err: any) {
      res.status(500).json({ error: `Delete listing failure: ${err.message}` });
    }
  });

  // ----------------------------------------------------
  // MESSAGES PROTOCOL ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
      const snap = await getDocs(collection(db, 'messages'));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: `Fetch communications error: ${err.message}` });
    }
  });

  app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
      const msg = req.body;
      if (!msg.id) return res.status(400).json({ error: 'Message ID must be provided.' });
      await setDoc(doc(db, 'messages', msg.id), cleanUndefined(msg));
      res.status(201).json({ message: 'Communication transmitted successfully.', msg });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/messages/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const messageRef = doc(db, 'messages', id);
      await updateDoc(messageRef, cleanUndefined(payload));
      res.json({ message: 'Message updated successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------------------------------------------
  // AUDIT LOGS ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/logs', authenticateToken, async (req, res) => {
    try {
      const snap = await getDocs(collection(db, 'logs'));
      const list: any[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/logs', authenticateToken, async (req, res) => {
    try {
      const log = req.body;
      if (log.logoutTime) {
        log.action = 'User Logout';
      } else if (!log.action) {
        log.action = 'User Login';
      }
      await setDoc(doc(db, 'logs', log.id), cleanUndefined(log));
      res.status(201).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------------------------------------------
  // VITE DEV MIDDLEWARE AND STATIC PRODUCTION SERVER
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
    console.log(`🚀 GEOVERA server active: http://localhost:${PORT}`);
  });
}

startServer();
