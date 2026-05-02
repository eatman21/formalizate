const supabase = require('../config/supabase');

const register = async (req, res) => {
  const { name, role, phone, city, document_type, document_number } = req.body;

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

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Returns profile or 404 — does NOT auto-create (use /register for that)
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
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

module.exports = { register, login };
