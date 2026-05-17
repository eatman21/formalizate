const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabaseAdmin');

const ALLOWED_STATUSES = ['not_started', 'in_progress', 'completed'];

// Public: formalization steps are read-only reference data.
const getSteps = async (req, res) => {
  const { data, error } = await supabase
    .from('formalization_steps')
    .select('*')
    .order('order_index');
  if (error) {
    console.error('[stepController.getSteps]', error);
    return res.status(500).json({ error: 'Error al obtener los pasos' });
  }
  res.json(data);
};

const getUserProgress = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('user_step_progress')
    .select('*, formalization_steps(*)')
    .eq('firebase_uid', req.user.uid);
  if (error) {
    console.error('[stepController.getUserProgress]', error);
    return res.status(500).json({ error: 'Error al obtener el progreso' });
  }
  res.json(data);
};

const updateStepProgress = async (req, res) => {
  const { stepId } = req.params;
  const { status, notes } = req.body;

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Usa: ${ALLOWED_STATUSES.join(', ')}` });
  }

  const { data, error } = await supabaseAdmin
    .from('user_step_progress')
    .upsert(
      {
        firebase_uid: req.user.uid,
        step_id: stepId,
        status,
        notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid,step_id' }
    )
    .select()
    .single();
  if (error) {
    console.error('[stepController.updateStepProgress]', error);
    return res.status(500).json({ error: 'Error al actualizar el progreso' });
  }
  res.json(data);
};

module.exports = { getSteps, getUserProgress, updateStepProgress };
