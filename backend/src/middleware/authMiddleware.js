const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  if (!admin.apps.length) {
    return res.status(503).json({ error: 'Servicio de autenticación no configurado. Agrega las credenciales de Firebase.' });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };
