const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabaseAdmin');

const MAX_LIMIT = 50;

// Public routes use the anon client (RLS enforces active-only, no email).
const getVacancies = async (req, res) => {
  const { city, category, page = 1, limit = 10 } = req.query;
  const safeLimit = Math.min(Number(limit) || 10, MAX_LIMIT);
  const safePage = Math.max(Number(page) || 1, 1);

  let query = supabase
    .from('vacancies')
    .select('*, users(name)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((safePage - 1) * safeLimit, safePage * safeLimit - 1);
  if (city) query = query.ilike('city', `%${city}%`);
  if (category) query = query.eq('category', category);
  const { data, error, count } = await query;
  if (error) {
    console.error('[vacancyController.getVacancies]', error);
    return res.status(500).json({ error: 'Error al obtener las vacantes' });
  }
  res.json({ data, total: count, page: safePage, limit: safeLimit });
};

const getVacancy = async (req, res) => {
  const { data, error } = await supabase
    .from('vacancies')
    .select('*, users(name)')
    .eq('id', req.params.id)
    .eq('status', 'active')
    .single();
  if (error) return res.status(404).json({ error: 'Vacante no encontrada' });
  res.json(data);
};

// Authenticated routes use the admin client.
const getMyVacancies = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('vacancies')
    .select('*, applications(count)')
    .eq('employer_id', req.dbUser.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[vacancyController.getMyVacancies]', error);
    return res.status(500).json({ error: 'Error al obtener tus vacantes' });
  }
  res.json(data);
};

const createVacancy = async (req, res) => {
  const { title, description, salary, city, category, requirements, contract_type } = req.body;

  if (!title || !description || !city || !category) {
    return res.status(400).json({ error: 'title, description, city y category son requeridos' });
  }

  const { data, error } = await supabaseAdmin
    .from('vacancies')
    .insert({
      title,
      description,
      salary: salary ? Number(salary) : null,
      city,
      category,
      requirements,
      contract_type,
      employer_id: req.dbUser.id,
      status: 'active',
    })
    .select()
    .single();
  if (error) {
    console.error('[vacancyController.createVacancy]', error);
    return res.status(500).json({ error: 'Error al crear la vacante' });
  }
  res.status(201).json(data);
};

const updateVacancy = async (req, res) => {
  const { title, description, salary, city, category, requirements, contract_type, status } = req.body;

  const allowedStatuses = ['active', 'paused', 'closed'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const updates = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(salary !== undefined && { salary: salary ? Number(salary) : null }),
    ...(city !== undefined && { city }),
    ...(category !== undefined && { category }),
    ...(requirements !== undefined && { requirements }),
    ...(contract_type !== undefined && { contract_type }),
    ...(status !== undefined && { status }),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('vacancies')
    .update(updates)
    .eq('id', req.params.id)
    .eq('employer_id', req.dbUser.id)
    .select()
    .single();
  if (error) {
    console.error('[vacancyController.updateVacancy]', error);
    return res.status(500).json({ error: 'Error al actualizar la vacante' });
  }
  res.json(data);
};

const deleteVacancy = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('vacancies')
    .update({ status: 'closed' })
    .eq('id', req.params.id)
    .eq('employer_id', req.dbUser.id);
  if (error) {
    console.error('[vacancyController.deleteVacancy]', error);
    return res.status(500).json({ error: 'Error al cerrar la vacante' });
  }
  res.json({ message: 'Vacante cerrada exitosamente' });
};

module.exports = { getVacancies, getVacancy, getMyVacancies, createVacancy, updateVacancy, deleteVacancy };
