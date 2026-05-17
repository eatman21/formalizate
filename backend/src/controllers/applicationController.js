const supabaseAdmin = require('../config/supabaseAdmin');

const applyToVacancy = async (req, res) => {
  const { vacancy_id, cover_letter } = req.body;
  if (!vacancy_id) return res.status(400).json({ error: 'vacancy_id es requerido' });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (!user) return res.status(404).json({ error: 'Perfil de trabajador no encontrado' });

  const { data: existing } = await supabaseAdmin
    .from('applications')
    .select('id')
    .eq('vacancy_id', vacancy_id)
    .eq('applicant_id', user.id)
    .single();
  if (existing) return res.status(409).json({ error: 'Ya aplicaste a esta vacante' });

  const { data, error } = await supabaseAdmin
    .from('applications')
    .insert({ vacancy_id, applicant_id: user.id, cover_letter: cover_letter || null, status: 'pending' })
    .select()
    .single();
  if (error) {
    console.error('[applicationController.applyToVacancy]', error);
    return res.status(500).json({ error: 'Error al enviar la aplicación' });
  }
  res.status(201).json(data);
};

const getMyApplications = async (req, res) => {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (!user) return res.status(404).json({ error: 'Perfil no encontrado' });

  const { data, error } = await supabaseAdmin
    .from('applications')
    .select('*, vacancies(id, title, city, salary, category, contract_type, status)')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[applicationController.getMyApplications]', error);
    return res.status(500).json({ error: 'Error al obtener las aplicaciones' });
  }
  res.json(data);
};

const getVacancyApplications = async (req, res) => {
  const { vacancyId } = req.params;
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();

  const { data: vacancy } = await supabaseAdmin
    .from('vacancies')
    .select('employer_id')
    .eq('id', vacancyId)
    .single();
  if (!vacancy || vacancy.employer_id !== user?.id) {
    return res.status(403).json({ error: 'No autorizado para ver estas aplicaciones' });
  }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .select('*, users(name, email, phone, document_type, document_number, city)')
    .eq('vacancy_id', vacancyId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[applicationController.getVacancyApplications]', error);
    return res.status(500).json({ error: 'Error al obtener las aplicaciones' });
  }
  res.json(data);
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Usa: ${validStatuses.join(', ')}` });
  }

  const { data: app } = await supabaseAdmin
    .from('applications')
    .select('vacancy_id')
    .eq('id', req.params.id)
    .single();
  if (!app) return res.status(404).json({ error: 'Aplicación no encontrada' });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (!user) return res.status(404).json({ error: 'Perfil no encontrado' });

  const { data: vacancy } = await supabaseAdmin
    .from('vacancies')
    .select('employer_id')
    .eq('id', app.vacancy_id)
    .single();
  if (!vacancy || vacancy.employer_id !== user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    console.error('[applicationController.updateApplicationStatus]', error);
    return res.status(500).json({ error: 'Error al actualizar el estado' });
  }
  res.json(data);
};

module.exports = { applyToVacancy, getMyApplications, getVacancyApplications, updateApplicationStatus };
