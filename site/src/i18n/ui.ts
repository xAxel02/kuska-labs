/**
 * Textos de la interfaz en ambos idiomas.
 * BORRADOR: los textos finales se definirán con el equipo.
 * Regla de marca: nunca decir "empresa", "S.A.C." ni "factura"; usar "equipo" / "colectivo".
 */

export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    'meta.title': 'Kuska Labs — Software hecho en equipo, desde Perú para el mundo',
    'meta.description':
      'Colectivo de ingenieros de sistemas peruanos. Webs, sistemas a medida, ERP, CRM, chatbots de WhatsApp y apps para negocios de Perú y el extranjero. Diagnóstico gratis de 30 minutos.',

    'nav.services': 'Servicios',
    'nav.portfolio': 'Portafolio',
    'nav.process': 'Proceso',
    'nav.team': 'Equipo',
    'nav.contact': 'Contacto',
    'nav.menu': 'Menú',
    'nav.skip': 'Saltar al contenido',
    'nav.switch': 'English',
    'nav.switchLabel': 'Ver el sitio en inglés',

    'cta.diagnosis': 'Agenda tu diagnóstico gratis',
    'cta.whatsapp': 'Escríbenos por WhatsApp',
    'cta.whatsappShort': 'WhatsApp',
    'whatsapp.message': 'Hola Kuska Labs, quiero conversar sobre un proyecto.',

    'hero.label': '// desarrollo de software a medida',
    'hero.title': 'Software hecho en equipo, desde Perú para el mundo.',
    'hero.lead':
      'Webs, sistemas a medida, ERP y chatbots de WhatsApp para negocios que hoy se llevan en Excel o en el chat. Empezamos con un diagnóstico gratis de 30 minutos.',
    'hero.note': 'Kuska significa «juntos» en quechua.',

    'services.label': '// servicios',
    'services.title': 'Lo que construimos',
    'services.lead': 'Desde tu primera web hasta el sistema que ordena todo tu negocio.',
    'services.from': 'desde',
    'services.monthly': '+ mensualidad',
    'services.perMonth': '/ mes',

    'portfolio.label': '// portafolio',
    'portfolio.title': 'Demos que puedes probar',
    'portfolio.lead': 'Proyectos propios para que veas cómo trabajamos antes de empezar el tuyo.',
    'portfolio.building': 'En construcción',
    'portfolio.live': 'Ver demo',

    'process.label': '// proceso',
    'process.title': 'Cómo trabajamos',
    'process.lead': 'Un proceso claro, con avances que ves cada semana.',

    'team.label': '// equipo',
    'team.title': 'Quiénes somos',
    'team.lead':
      'Somos un colectivo de estudiantes y egresados de Ingeniería de Sistemas del Perú. Trabajamos de forma remota para clientes de Perú, Latinoamérica, España y EE. UU.',
    'team.empty': 'Muy pronto presentaremos a cada integrante del equipo.',

    'contact.label': '// contacto',
    'contact.title': 'Conversemos sobre tu proyecto',
    'contact.lead': 'Cuéntanos qué necesitas y agendamos un diagnóstico gratis de 30 minutos, sin compromiso.',
    'form.name': 'Nombre',
    'form.contact': 'WhatsApp o correo',
    'form.business': 'Tipo de negocio',
    'form.businessPlaceholder': 'Ej. ferretería, consultorio, academia',
    'form.message': '¿Qué te gustaría resolver?',
    'form.submit': 'Agenda tu diagnóstico gratis',
    'form.note': 'Al enviar se abrirá WhatsApp con tu mensaje listo.',
    'form.required': 'Completa este campo.',

    'footer.tagline': 'Software hecho en equipo, desde Perú para el mundo.',
    'footer.legal':
      'Kuska Labs es un colectivo de profesionales independientes. Cada integrante emite recibo por honorarios electrónico.',
    'footer.rights': 'Hecho con cariño en Perú.',

    'notFound.title': 'Página no encontrada',
    'notFound.text': 'La página que buscas no existe o cambió de lugar.',
    'notFound.back': 'Volver al inicio',
  },
  en: {
    'meta.title': 'Kuska Labs — Software built together, from Peru to the world',
    'meta.description':
      'A collective of Peruvian software engineers. Websites, custom systems, ERP, CRM, WhatsApp chatbots and mobile apps for businesses in Latin America, Spain and the US. Free 30-minute discovery call.',

    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.process': 'Process',
    'nav.team': 'Team',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.skip': 'Skip to content',
    'nav.switch': 'Español',
    'nav.switchLabel': 'View the site in Spanish',

    'cta.diagnosis': 'Book your free discovery call',
    'cta.whatsapp': 'Message us on WhatsApp',
    'cta.whatsappShort': 'WhatsApp',
    'whatsapp.message': "Hi Kuska Labs, I'd like to talk about a project.",

    'hero.label': '// custom software development',
    'hero.title': 'Software built together, from Peru to the world.',
    'hero.lead':
      'Websites, custom systems, ERP and WhatsApp chatbots for growing businesses, plus white-label development for agencies. It all starts with a free 30-minute discovery call.',
    'hero.note': 'Kuska means “together” in Quechua.',

    'services.label': '// services',
    'services.title': 'What we build',
    'services.lead': 'From your first website to the system that runs your whole business.',
    'services.from': 'from',
    'services.monthly': '+ monthly fee',
    'services.perMonth': '/ month',

    'portfolio.label': '// portfolio',
    'portfolio.title': 'Demos you can try',
    'portfolio.lead': 'Our own projects, so you can see how we work before we start yours.',
    'portfolio.building': 'In progress',
    'portfolio.live': 'View demo',

    'process.label': '// process',
    'process.title': 'How we work',
    'process.lead': 'A clear process, with progress you can see every week.',

    'team.label': '// team',
    'team.title': 'Who we are',
    'team.lead':
      'We are a collective of Systems Engineering students and graduates from Peru, working remotely for clients in Peru, Latin America, Spain and the US.',
    'team.empty': 'We will introduce every team member very soon.',

    'contact.label': '// contact',
    'contact.title': "Let's talk about your project",
    'contact.lead': 'Tell us what you need and we will book a free 30-minute discovery call, no strings attached.',
    'form.name': 'Name',
    'form.contact': 'WhatsApp or email',
    'form.business': 'Type of business',
    'form.businessPlaceholder': 'e.g. clinic, online store, marketing agency',
    'form.message': 'What would you like to solve?',
    'form.submit': 'Book your free discovery call',
    'form.note': 'Submitting opens WhatsApp with your message ready to send.',
    'form.required': 'Please fill in this field.',

    'footer.tagline': 'Software built together, from Peru to the world.',
    'footer.legal': 'Kuska Labs is a collective of independent professionals.',
    'footer.rights': 'Made with care in Peru.',

    'notFound.title': 'Page not found',
    'notFound.text': 'The page you are looking for does not exist or has moved.',
    'notFound.back': 'Back to home',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

/** Proceso de trabajo (8 pasos), en ambos idiomas. */
export const processSteps: Record<Lang, { title: string; text: string }[]> = {
  es: [
    { title: 'Nos escribes', text: 'Por WhatsApp o el formulario, nos cuentas tu idea o problema.' },
    { title: 'Diagnóstico gratis', text: '30 minutos para entender tu negocio y lo que realmente necesitas.' },
    { title: 'Propuesta y contrato', text: 'Alcance, plazos y precio claros, por escrito.' },
    { title: 'Adelanto del 50%', text: 'Con el adelanto reservamos al equipo y arrancamos.' },
    { title: 'Desarrollo por sprints', text: 'Avanzamos por etapas cortas y te mostramos demos en cada una.' },
    { title: 'Entrega y capacitación', text: 'Lo publicamos y te enseñamos a usarlo a ti y a tu equipo.' },
    { title: 'Pago final del 50%', text: 'Pagas el saldo cuando el proyecto está entregado y funcionando.' },
    { title: 'Mantenimiento mensual', text: 'Opcional: soporte, actualizaciones y mejoras continuas.' },
  ],
  en: [
    { title: 'You reach out', text: 'Tell us about your idea or problem on WhatsApp or through the form.' },
    { title: 'Free discovery call', text: '30 minutes to understand your business and what you really need.' },
    { title: 'Proposal & contract', text: 'Clear scope, timeline and price, in writing.' },
    { title: '50% upfront', text: 'The deposit reserves the team and we get started.' },
    { title: 'Sprints with demos', text: 'We build in short iterations and show you a demo after each one.' },
    { title: 'Delivery & training', text: 'We launch it and train you and your team to use it.' },
    { title: 'Final 50% payment', text: 'You pay the balance once the project is delivered and working.' },
    { title: 'Monthly maintenance', text: 'Optional: support, updates and continuous improvements.' },
  ],
};
