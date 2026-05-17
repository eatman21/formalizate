const supabaseAdmin = require('../config/supabaseAdmin');

const requireRole = (...roles) => async (req, res, next) => {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, role')
    .eq('firebase_uid', req.user.uid)
    .single();

  if (!user) return res.status(404).json({ error: 'Perfil no encontrado' });
  if (!roles.includes(user.role)) return res.status(403).json({ error: 'Acceso no autorizado' });

  req.dbUser = user;
  next();
};

module.exports = requireRole;
