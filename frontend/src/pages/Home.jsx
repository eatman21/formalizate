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
      {/* Hero — banderines de colores */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero-banderines.jpg"
          alt="Calle colombiana con banderines"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <div className="flex justify-center gap-2 mb-6">
            <span className="w-10 h-5 bg-colombia-yellow rounded-sm shadow" />
            <span className="w-10 h-5 bg-colombia-blue rounded-sm shadow" />
            <span className="w-10 h-5 bg-colombia-red rounded-sm shadow" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight drop-shadow-lg">
            Formaliza tu empleo<br />
            <span className="text-colombia-yellow">en Colombia</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Guía paso a paso para registrarte con la DIAN y Cámara de Comercio.
            Encuentra empleo formal y conoce todos tus derechos laborales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/registro"
              className="bg-colombia-yellow text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors text-base shadow-lg"
            >
              Comenzar gratis
            </Link>
            <Link
              to="/vacantes"
              className="border-2 border-white/70 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-base backdrop-blur-sm"
            >
              Ver vacantes
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-5">
            Más de 2.7 millones de trabajadores informales en Bogotá pueden formalizarse hoy
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">¿Cómo funciona?</h2>
          <p className="text-center text-gray-500 text-sm mb-12">
            Tres pasos simples para empezar tu camino hacia el empleo formal
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-5xl font-black text-primary-100 block mb-4">{s.num}</span>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección palenquera — historia humana */}
      <section className="relative py-0 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          <div className="relative">
            <img
              src="/images/palenquera.jpg"
              alt="Palenquera colombiana"
              className="w-full h-full object-cover object-top"
              style={{ minHeight: '400px' }}
            />
          </div>
          <div className="bg-primary-800 text-white flex items-center px-10 py-16">
            <div>
              <span className="text-colombia-yellow text-sm font-bold uppercase tracking-widest mb-4 block">
                Para trabajadores colombianos
              </span>
              <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                El trabajo informal merece volverse formal
              </h2>
              <p className="text-primary-200 leading-relaxed mb-6">
                Millones de colombianos trabajan cada día sin acceso a salud, pensión
                ni protección laboral. FormalízaTe es la guía gratuita que te lleva
                paso a paso hacia el empleo con derechos.
              </p>
              <Link
                to="/registro"
                className="inline-block bg-colombia-yellow text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
              >
                Empezar ahora →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Beneficios de formalizarte
          </h2>
          <p className="text-center text-gray-500 text-sm mb-12">
            El empleo formal te da acceso a derechos que el trabajo informal no garantiza
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card flex items-start gap-4 hover:shadow-md transition-shadow">
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

      {/* Mochilas wayuu — sección cultural */}
      <section className="relative overflow-hidden py-24 px-4">
        <img
          src="/images/mochilas-wayuu.jpg"
          alt="Artesanías colombianas wayuu"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Tu ruta de formalización paso a paso</h2>
          <p className="text-white/70 text-sm mb-10">
            Te guiamos desde el RUT en la DIAN hasta el registro en Cámara de Comercio
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
            {[
              { entity: 'DIAN', title: 'Obtener el RUT', desc: 'Registro Único Tributario gratuito' },
              { entity: 'Cámara de Comercio', title: 'Registro mercantil', desc: 'Si operas como comerciante' },
              { entity: 'MinTrabajo', title: 'Afiliación seguridad social', desc: 'EPS, pensión y riesgos laborales' },
              { entity: 'SENA', title: 'Capacitación gratuita', desc: 'Cursos para mejorar tu empleabilidad' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <span className="w-2 h-2 bg-colombia-yellow rounded-full mt-2 shrink-0" />
                <div>
                  <span className="text-xs text-colombia-yellow font-bold uppercase tracking-wide">{item.entity}</span>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/formalizacion" className="inline-block bg-colombia-yellow text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
            Ver guía completa
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-primary-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">¿Listo para dar el primer paso?</h2>
        <p className="text-primary-200 mb-8 max-w-md mx-auto">
          Únete a FormalízaTe y accede a todos tus derechos como trabajador colombiano.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/registro"
            className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/vacantes"
            className="border border-white/50 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            Explorar vacantes
          </Link>
        </div>
      </section>
    </div>
  );
}
