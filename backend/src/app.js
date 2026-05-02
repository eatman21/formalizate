require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const stepRoutes = require('./routes/steps');
const vacancyRoutes = require('./routes/vacancies');
const applicationRoutes = require('./routes/applications');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'FormalízaTe API', timestamp: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/applications', applicationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor FormalízaTe corriendo en puerto ${PORT}`));

module.exports = app;
