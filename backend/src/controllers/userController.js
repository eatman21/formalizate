const supabase = require('../config/supabase');

const getProfile = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (error) return res.status(404).json({ error: 'Perfil no encontrado' });
  res.json(data);
};

const createOrUpdateProfile = async (req, res) => {
  const { name, role, phone, city, document_type, document_number } = req.body;
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        firebase_uid: req.user.uid,
        email: req.user.email,
        name,
        role,
        phone,
        city,
        document_type,
        document_number,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid' }
    )
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

module.exports = { getProfile, createOrUpdateProfile };
