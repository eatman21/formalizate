const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (err) {
    console.warn('[Firebase] Admin SDK not initialized — auth routes unavailable until real credentials are set.');
    console.warn('[Firebase]', err.message);
  }
}

module.exports = admin;
