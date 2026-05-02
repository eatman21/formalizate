const supabase = require('../config/supabase');

const getVacancies = async (req, res) => {
  const { city, category, page = 1, limit = 10 } = req.query;
  let query = supabase
    .from('vacancies')
    .select('*, users(name, email)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (city) query = query.ilike('city', `%${city}%`);
  if (category) query = query.eq('category', category);
  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data, total: count, page: Number(page), limit: Number(limit) });
};

const getVacancy = async (req, res) => {
  const { data, error } = await supabase
    .from('vacancies')
    .select('*, users(name, email)')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Vacante no encontrada' });
  res.json(data);
};

// Employer-only: returns all their vacancies with application count
const getMyVacancies = async (req, res) => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (userError) return res.status(404).json({ error: 'Perfil no encontrado' });

  const { data, error } = await supabase
    .from('vacancies')
    .select('*, applications(count)')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createVacancy = async (req, res) => {
  const { title, description, salary, city, category, requirements, contract_type } = req.body;
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  if (userError) return res.status(404).json({ error: 'Perfil de empleador no encontrado' });

  const { data, error } = await supabase
    .from('vacancies')
    .insert({
      title,
      description,
      salary: salary ? Number(salary) : null,
      city,
      category,
      requirements,
      contract_type,
      employer_id: user.id,
      status: 'active',
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updateVacancy = async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  const { data, error } = await supabase
    .from('vacancies')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('employer_id', user.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deleteVacancy = async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', req.user.uid)
    .single();
  const { error } = await supabase
    .from('vacancies')
    .update({ status: 'closed' })
    .eq('id', req.params.id)
    .eq('employer_id', user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Vacante cerrada exitosamente' });
};

module.exports = { getVacancies, getVacancy, getMyVacancies, createVacancy, updateVacancy, deleteVacancy };
