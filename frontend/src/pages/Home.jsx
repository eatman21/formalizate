import { Link } from 'react-router-dom';

const HOW_IT_WORKS = [
  { num: '01', title: 'Regístrate', desc: 'Crea tu cuenta como trabajador o empleador en minutos' },
  { num: '02', title: 'Sigue la guía', desc: 'Pasos claros para registrarte con DIAN y Cámara de Comercio' },
  { num: '03', title: 'Consigue trabajo', desc: 'Aplica a vacantes formales o publica empleos en tu empresa' },
];

const BENEFITS = [
  { icon: '🛡️', title: 'Seguridad social', desc: 'Accede a salud EPS, pensión AFP y ARL' },
  { icon: '📋', title: 'Contrato legal', desc: 'Protección jurídica para empleadores y empleados' },
  { icon: '💰', title: 'Créditos formales', desc: 'Con empleo formal accedes a productos financieros bancarios' },
  { icon: '📈', title: 'Crecimiento', desc: 'Capacitación SENA, cesantías y oportunidades de ascenso' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1.5 mb-6">
            <span className="w-8 h-4 bg-colombia-yellow rounded-sm" />
            <span className="w-8 h-4 bg-colombia-blue rounded-sm" />
            <span className="w-8 h-4 bg-colombia-red rounded-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            Formaliza tu empleo en<br />
            <span className="text-colombia-yellow">Bogotá, Colombia</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Guía paso a paso para registrarte con la DIAN y Cámara de Comercio.
            Encuentra empleo formal y conoce todos tus derechos laborales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/registro"
              className="bg-colombia-yellow text-gray-900 px-8 py-3.5 rounded-lg font-bold hover:bg-yellow-300 transition-colors text-base"
            >
              Comenzar gratis
            </Link>
            <Link
              to="/vacantes"
              className="border-2 border-white/60 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-base"
            >
              Ver vacantes
            </Link>
          </div>
          <p className="text-primary-300 text-sm mt-4">
            Más de 2.7 millones de trabajadores informales en Bogotá pueden formalizarse hoy
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">¿Cómo funciona?</h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            Tres pasos simples para empezar tu camino hacia el empleo formal
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-4xl font-black text-primary-100 block mb-3">{s.num}</span>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Beneficios de formalizarte
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            El empleo formal te da acceso a derechos que el trabajo informal no garantiza
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card flex items-start gap-4">
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{b.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pasos de formalización preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tu ruta de formalización paso a paso
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Te guiamos desde el RUT en la DIAN hasta el registro en Cámara de Comercio
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
            {[
              { entity: 'DIAN', title: 'Obtener el RUT', desc: 'Registro Único Tributario gratuito' },
              { entity: 'Cámara de Comercio', title: 'Registro mercantil', desc: 'Si operas como comerciante' },
              { entity: 'MinTrabajo', title: 'Afiliación seguridad social', desc: 'EPS, pensión y riesgos laborales' },
              { entity: 'SENA', title: 'Capacitación gratuita', desc: 'Cursos para mejorar tu empleabilidad' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0" />
                <div>
                  <span className="text-xs text-primary-600 font-semibold">{item.entity}</span>
                  <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/formalizacion" className="btn-primary">
            Ver guía completa
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-primary-700 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">¿Listo para dar el primer paso?</h2>
        <p className="text-primary-200 mb-6 max-w-md mx-auto">
          Únete a FormalízaTe y accede a todos tus derechos como trabajador colombiano.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/registro"
            className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/vacantes"
            className="border border-white/50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Explorar vacantes
          </Link>
        </div>
      </section>
    </div>
  );
}
