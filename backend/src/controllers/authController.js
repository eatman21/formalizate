const supabase = require('../config/supabase');

const ALLOWED_ROLES = ['worker', 'employer'];
const ALLOWED_DOCUMENT_TYPES = ['CC', 'CE', 'PA', 'NIT'];

const register = async (req, res) => {
  const { name, role, phone, city, document_type, document_number } = req.body;

  if (role && !ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  if (document_type && !ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
    return res.status(400).json({ error: 'Tipo de documento inválido' });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();

  if (existing) {
    return res.status(409).json({ error: 'Usuario ya registrado' });
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      firebase_uid: req.user.uid,
      email: req.user.email,
      name: name || req.user.email?.split('@')[0],
      role: role || 'worker',
      phone: phone || null,
      city: city || 'Bogotá',
      document_type: document_type || 'CC',
      document_number: document_number || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[authController.register]', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
  res.status(201).json(data);
};

const login = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', req.user.uid)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Perfil no encontrado. Completa tu registro.' });
    }
    console.error('[authController.login]', error);
    return res.status(500).json({ error: 'Error al obtener el perfil' });
  }

  res.json(data);
};

module.exports = { register, login };
