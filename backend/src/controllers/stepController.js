const supabase = require('../config/supabase');

const getSteps = async (req, res) => {
  const { data, error } = await supabase
    .from('formalization_steps')
    .select('*')
    .order('order_index');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getUserProgress = async (req, res) => {
  const { data, error } = await supabase
    .from('user_step_progress')
    .select('*, formalization_steps(*)')
    .eq('firebase_uid', req.user.uid);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const updateStepProgress = async (req, res) => {
  const { stepId } = req.params;
  const { status, notes } = req.body;
  const { data, error } = await supabase
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
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

module.exports = { getSteps, getUserProgress, updateStepProgress };
