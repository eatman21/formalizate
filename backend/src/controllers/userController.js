const supabaseAdmin = require('../config/supabaseAdmin');

const ALLOWED_ROLES = ['worker', 'employer'];
const ALLOWED_DOCUMENT_TYPES = ['CC', 'CE', 'PA', 'NIT'];

const getProfile = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (error) return res.status(404).json({ error: 'Perfil no encontrado' });
  res.json(data);
};

const createOrUpdateProfile = async (req, res) => {
  const { name, role, phone, city, document_type, document_number } = req.body;

  if (role && !ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  if (document_type && !ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
    return res.status(400).json({ error: 'Tipo de documento inválido' });
  }

  const { data, error } = await supabaseAdmin
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

  if (error) {
    console.error('[userController.createOrUpdateProfile]', error);
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
  res.status(200).json(data);
};

module.exports = { getProfile, createOrUpdateProfile };
