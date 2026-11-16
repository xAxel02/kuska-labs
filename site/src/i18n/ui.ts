/**
 * Textos de la interfaz en ambos idiomas (versión final 1.0).
 * Regla de marca: nunca decir "empresa", "S.A.C." ni "factura"; usar "equipo" / "colectivo".
 */

export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    "audience.title": "Para quién trabajamos",
    "audience.lead": "Soluciones para tareas diarias de negocios de Trujillo y La Libertad.",
    "small.title": "Por qué un equipo pequeño",
    "small.manifesto": "Hablas con quien programa. Revisamos tu forma de trabajar y acordamos qué construir antes de escribir código.",
    "home.faq": "Antes de empezar",
    "service.includes": "Qué incluye",
    "service.audience": "Para quién es",
    "service.steps": "Cómo trabajamos",
    "service.delivery": "Qué recibes al final",

    'meta.title': 'Software y páginas web en Trujillo | Kuska Labs',
    'meta.description':
      'Desarrollo de software en Trujillo, La Libertad, Perú: sistemas a medida y páginas web con precios accesibles. Agenda tu diagnóstico gratis.',

    'nav.services': 'Servicios',
    'nav.portfolio': 'Portafolio',
    'nav.process': 'Proceso',
    'nav.team': 'Equipo',
    'nav.contact': 'Contacto',
    'nav.menu': 'Menú',
    'nav.primary': 'Navegación principal',
    'nav.skip': 'Saltar al contenido',
    'nav.switch': 'English',
    'nav.switchLabel': 'Ver el sitio en inglés',

    'cta.diagnosis': 'Agenda tu diagnóstico gratis',
    'cta.whatsapp': 'Escríbenos por WhatsApp',
    'cta.whatsappShort': 'WhatsApp',
    'whatsapp.message': 'Hola Kuska Labs, quiero conversar sobre un proyecto.',

    'hero.title': 'Software hecho en equipo, desde Perú para el mundo.',
    'hero.flowTitle': 'Mira cómo un mensaje de WhatsApp se convierte en datos para tu negocio',
    'hero.lead':
      '¿Tu negocio todavía depende de Excel, cuadernos o mensajes de WhatsApp? Creamos la web, el sistema o el chatbot que lo ordena. Empezamos con un diagnóstico gratis de 30 minutos y una propuesta clara, sin compromiso.',
    'hero.note': 'Kuska significa «juntos» en quechua.',
    'hero.location': 'Trabajamos desde Trujillo, La Libertad, para todo el Perú y clientes del extranjero.',
    'hero.launchPrices': 'Tenemos precios accesibles de lanzamiento, con alcance y costo acordados por escrito.',

    'services.title': 'Lo que construimos',
    'services.lead': 'Desde tu primera web hasta el sistema que ordena todo tu negocio, con precios claros desde el inicio.',
    'services.group.web': 'Tu presencia en internet',
    'services.group.web.text': 'Para que te encuentren en Google y te escriban.',
    'services.group.systems': 'Sistemas para tu operación',
    'services.group.systems.text': 'Para dejar el Excel y ver tu negocio en tiempo real.',
    'services.group.ai': 'IA y automatización',
    'services.group.ai.text': 'Para responder, agendar y vender sin estar pegado al celular.',
    'services.group.care': 'Siempre funcionando',
    'services.group.care.text': 'Para que lo que construimos siga al día después de la entrega.',
    'services.from': 'desde',
    'services.monthly': '+ mensualidad',
    'services.perMonth': '/ mes',
    'services.priceNote':
      'Precios de lanzamiento en soles, sin IGV: trabajamos con recibo por honorarios. Los precios en dólares son el equivalente aproximado de los precios en soles, con un tipo de cambio referencial de S/ 3.50 por US$ 1. El monto final depende del alcance y lo acordamos por escrito después del diagnóstico. Los costos de terceros (mensajes de WhatsApp, hosting o facturación electrónica) se pagan aparte.',
    'services.view': 'Ver servicio',
    'service.forWhom': 'Ideal para',
    'service.faq': 'Preguntas frecuentes',
    'service.related': 'Servicios relacionados',
    'service.back': 'Ver todos los servicios',
    'service.price': 'Precio referencial',
    'service.ctaTitle': 'Cuéntanos qué necesitas',
    'service.ctaText': 'Agenda tu diagnóstico gratis o escríbenos por WhatsApp. Revisamos tu caso y te damos una propuesta clara.',

    'portfolio.title': 'Trabajo real y demos',
    'portfolio.lead': 'Un proyecto publicado para un cliente y demos propias, para que veas cómo trabajamos antes de empezar el tuyo.',
    'portfolio.client': 'Proyecto real',
    'portfolio.demo': 'Demo',
    'portfolio.visit': 'Ver sitio',
    'portfolio.want': 'Quiero una web así',
    'portfolio.wantMessage': 'Hola Kuska Labs, vi su proyecto {project} y quiero algo así para mi negocio.',
    'portfolio.replay': 'Repetir conversación',
    'portfolio.building': 'En construcción',
    'portfolio.live': 'Probar demo',

    'process.title': 'Cómo trabajamos',
    'process.lead': 'En cada etapa sabes qué estamos haciendo, cuánto falta y cuánto cuesta.',
    'process.payNote': 'Pagas en dos partes: la mitad para empezar y la otra mitad cuando el proyecto ya funciona.',
    'process.payBadge': 'Pago del 50 %',

    'team.title': 'Quiénes están detrás',
    'team.lead':
      'Kuska Labs es un colectivo de ingenieros de sistemas del Perú. Trabajamos de forma remota para clientes de Perú, Latinoamérica, España y EE. UU., y cada proyecto tiene un responsable directo que te acompaña de principio a fin.',
    'team.empty': 'Muy pronto presentaremos a cada integrante del equipo.',

    'contact.title': 'Conversemos sobre tu proyecto',
    'contact.lead':
      'Cuéntanos qué necesitas. Te respondemos en menos de 24 horas hábiles para agendar tu diagnóstico gratis de 30 minutos, sin compromiso.',
    'form.name': 'Nombre',
    'form.contact': 'WhatsApp o correo',
    'form.business': 'Tipo de negocio',
    'form.businessPlaceholder': 'Ej. ferretería, consultorio, academia',
    'form.message': '¿Qué te gustaría resolver?',
    'form.submit': 'Agenda tu diagnóstico gratis',
    'form.sending': 'Enviando…',
    'form.note': 'Al enviar se abrirá WhatsApp con tu mensaje listo.',
    'form.noteApi': 'Te respondemos en menos de 24 horas hábiles.',
    'form.required': 'Completa este campo.',
    'form.consentRequired': 'Necesitamos tu autorización para contactarte.',
    'form.contactHint': 'Ej. 987 654 321 o tu@correo.com',
    'form.contactInvalid': 'Escribe un número de WhatsApp o un correo válido.',
    'form.consentPre': 'Acepto la ',
    'form.consentLink': 'política de privacidad',
    'form.consentPost': ' y que Kuska Labs me contacte sobre mi consulta.',
    'form.successTitle': '¡Listo! Recibimos tu mensaje.',
    'form.successText':
      'Te escribimos en menos de 24 horas hábiles para agendar tu diagnóstico. Si prefieres, continúa ahora por WhatsApp.',
    'form.errorCaptcha': 'No pudimos verificar que no eres un robot. Inténtalo de nuevo.',
    'form.errorGeneric': 'No pudimos enviar tu mensaje. Escríbenos por WhatsApp y te atendemos al momento.',

    'privacy.title': 'Política de privacidad',
    'privacy.description': 'Cómo tratamos los datos que nos envías por el formulario de contacto de Kuska Labs.',

    'footer.tagline': 'Software hecho en equipo, desde Perú para el mundo.',
    'footer.legal':
      'Kuska Labs es un colectivo de profesionales independientes. Cada integrante emite recibo por honorarios electrónico.',
    'footer.rights': 'Hecho con cariño en Perú.',
    'footer.copyright': 'Kuska Labs',
    'footer.privacy': 'Privacidad',
    'footer.location': 'Trujillo, La Libertad — Perú',
    'footer.services': 'Servicios',

    'notFound.title': 'Página no encontrada',
    'notFound.text': 'La página que buscas no existe o cambió de lugar.',
    'notFound.back': 'Volver al inicio',
  },
  en: {
    "audience.title": "Who we work with",
    "audience.lead": "Tools for everyday work in businesses across Trujillo and La Libertad.",
    "small.title": "Why a small team",
    "small.manifesto": "You talk to the people writing your code. We review how you work and agree on what to build before development starts.",
    "home.faq": "Before we start",
    "service.includes": "What’s included",
    "service.audience": "Who it’s for",
    "service.steps": "How we work",
    "service.delivery": "What you receive",

    'meta.title': 'Web & software development in Trujillo | Kuska Labs',
    'meta.description':
      'Web and software development in Trujillo, Peru: custom systems and websites with accessible launch pricing. Book your free discovery call today.',

    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.process': 'Process',
    'nav.team': 'Team',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.primary': 'Main navigation',
    'nav.skip': 'Skip to content',
    'nav.switch': 'Español',
    'nav.switchLabel': 'View the site in Spanish',

    'cta.diagnosis': 'Book your free discovery call',
    'cta.whatsapp': 'Message us on WhatsApp',
    'cta.whatsappShort': 'WhatsApp',
    'whatsapp.message': "Hi Kuska Labs, I'd like to talk about a project.",

    'hero.title': 'Software built together, from Peru to the world.',
    'hero.flowTitle': 'See how a WhatsApp message turns into data for your business',
    'hero.lead':
      'A remote team of Peruvian software engineers building websites, custom systems, ERP and WhatsApp chatbots for growing businesses, plus white-label development for agencies. It starts with a free 30-minute discovery call and a clear proposal.',
    'hero.note': 'Kuska means “together” in Quechua.',
    'hero.location': 'Based in Trujillo, La Libertad, serving all of Peru remotely and clients abroad.',
    'hero.launchPrices': 'We offer accessible launch pricing, with scope and cost agreed in writing.',

    'services.title': 'What we build',
    'services.lead': 'From your first website to the system that runs your whole business, with clear pricing from day one.',
    'services.group.web': 'Your online presence',
    'services.group.web.text': 'So customers find you on Google and get in touch.',
    'services.group.systems': 'Systems that run your operation',
    'services.group.systems.text': 'Leave the spreadsheets behind and see your business in real time.',
    'services.group.ai': 'AI and automation',
    'services.group.ai.text': 'Answer, book and sell without being glued to your phone.',
    'services.group.care': 'Always running',
    'services.group.care.text': 'Keep what we built up to date long after launch.',
    'services.from': 'from',
    'services.monthly': '+ monthly fee',
    'services.perMonth': '/ month',
    'services.priceNote':
      'Launch prices in US dollars are the approximate equivalent of the prices in soles, using a reference exchange rate of S/ 3.50 per US$ 1. The final price depends on scope and is agreed in writing after the discovery call. Third-party costs (WhatsApp messaging fees, hosting) are billed separately.',
    'services.view': 'View service',
    'service.forWhom': 'Ideal for',
    'service.faq': 'Frequently asked questions',
    'service.related': 'Related services',
    'service.back': 'View all services',
    'service.price': 'Starting price',
    'service.ctaTitle': 'Tell us what you need',
    'service.ctaText': 'Book your free discovery call or message us on WhatsApp. We will review your needs and send a clear proposal.',

    'portfolio.title': 'Real work and demos',
    'portfolio.lead': 'A live client project and our own demos, so you can see how we work before we start yours.',
    'portfolio.client': 'Client project',
    'portfolio.demo': 'Demo',
    'portfolio.visit': 'Visit site',
    'portfolio.want': 'I want something like this',
    'portfolio.wantMessage': 'Hi Kuska Labs, I saw your {project} project and I want something like it for my business.',
    'portfolio.replay': 'Replay conversation',
    'portfolio.building': 'In progress',
    'portfolio.live': 'Try the demo',

    'process.title': 'How we work',
    'process.lead': 'At every stage you know what we are doing, what is left and what it costs.',
    'process.payNote': 'You pay in two parts: half to get started and the other half once the project is working.',
    'process.payBadge': '50 % payment',

    'team.title': "Who's on the team",
    'team.lead':
      'Kuska Labs is a collective of software engineers from Peru. We work remotely for clients in Peru, Latin America, Spain and the US, and every project has one accountable lead from start to finish.',
    'team.empty': 'We will introduce every team member very soon.',

    'contact.title': "Let's talk about your project",
    'contact.lead':
      'Tell us what you need. We reply within one business day to book your free 30-minute discovery call, no strings attached.',
    'form.name': 'Name',
    'form.contact': 'WhatsApp or email',
    'form.business': 'Type of business',
    'form.businessPlaceholder': 'e.g. clinic, online store, marketing agency',
    'form.message': 'What would you like to solve?',
    'form.submit': 'Book your free discovery call',
    'form.sending': 'Sending…',
    'form.note': 'Submitting opens WhatsApp with your message ready to send.',
    'form.noteApi': 'We reply within one business day.',
    'form.required': 'Please fill in this field.',
    'form.consentRequired': 'We need your permission to contact you.',
    'form.contactHint': 'e.g. +1 415 555 0100 or you@email.com',
    'form.contactInvalid': 'Enter a valid WhatsApp number or email.',
    'form.consentPre': 'I accept the ',
    'form.consentLink': 'privacy policy',
    'form.consentPost': ' and agree to be contacted by Kuska Labs about my inquiry.',
    'form.successTitle': 'Done! We got your message.',
    'form.successText':
      'We will get back to you within one business day to book your discovery call. You can also continue on WhatsApp now.',
    'form.errorCaptcha': "We couldn't verify you're human. Please try again.",
    'form.errorGeneric': "We couldn't send your message. Please message us on WhatsApp and we'll help you right away.",

    'privacy.title': 'Privacy policy',
    'privacy.description': 'How we handle the data you send us through the Kuska Labs contact form.',

    'footer.tagline': 'Software built together, from Peru to the world.',
    'footer.legal': 'Kuska Labs is a collective of independent professionals.',
    'footer.rights': 'Made with care in Peru.',
    'footer.copyright': 'Kuska Labs',
    'footer.privacy': 'Privacy',
    'footer.location': 'Trujillo, La Libertad — Peru',
    'footer.services': 'Services',

    'notFound.title': 'Page not found',
    'notFound.text': 'The page you are looking for does not exist or has moved.',
    'notFound.back': 'Back to home',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

/** Proceso de trabajo (8 pasos), en ambos idiomas. */
export const processSteps: Record<Lang, { title: string; text: string }[]> = {
  es: [
    { title: 'Nos escribes', text: 'Por WhatsApp o el formulario, nos cuentas tu idea o el problema que quieres resolver.' },
    { title: 'Diagnóstico gratis', text: '30 minutos para entender tu negocio y lo que realmente necesitas. Sin costo ni compromiso.' },
    { title: 'Propuesta y contrato', text: 'Alcance, plazos y precio por escrito. Sin letra pequeña.' },
    { title: 'Adelanto del 50%', text: 'Con el adelanto reservamos el tiempo del equipo y arrancamos.' },
    { title: 'Desarrollo por sprints', text: 'Avanzamos en etapas cortas y te mostramos una demo al final de cada una.' },
    { title: 'Entrega y capacitación', text: 'Lo publicamos y te enseñamos a usarlo a ti y a tu equipo.' },
    { title: 'Pago final del 50%', text: 'Pagas el saldo cuando el proyecto está entregado y funcionando.' },
    { title: 'Mantenimiento mensual', text: 'Opcional: soporte, copias de seguridad, actualizaciones y mejoras.' },
  ],
  en: [
    { title: 'You reach out', text: 'Tell us about your idea or the problem you want to solve, on WhatsApp or through the form.' },
    { title: 'Free discovery call', text: '30 minutes to understand your business and what you really need. Free, no strings attached.' },
    { title: 'Proposal & contract', text: 'Scope, timeline and price in writing. No fine print.' },
    { title: '50% upfront', text: "The deposit reserves the team's time and we get started." },
    { title: 'Sprints with demos', text: 'We build in short iterations and show you a demo at the end of each one.' },
    { title: 'Delivery & training', text: 'We launch it and train you and your team to use it.' },
    { title: 'Final 50% payment', text: 'You pay the balance once the project is delivered and working.' },
    { title: 'Monthly maintenance', text: 'Optional: support, backups, updates and improvements.' },
  ],
};

export const audiences = {
  es: [
    { title: 'Ferreterías', problem: 'Las compras y las ventas dejan el stock desactualizado.', solution: 'Adaptamos un ERP con inventario, compras y ventas en un solo lugar.' },
    { title: 'Bodegas y minimarkets', problem: 'El cuaderno y las hojas sueltas dificultan revisar existencias.', solution: 'Construimos un sistema web para registrar movimientos y consultar inventario.' },
    { title: 'Clínicas y consultorios', problem: 'Las citas quedan repartidas entre mensajes y agendas.', solution: 'Creamos una agenda web y un chatbot de WhatsApp para gestionar reservas.' },
    { title: 'Talleres', problem: 'Cuesta saber qué cliente espera una respuesta o una cotización.', solution: 'Adaptamos un CRM con seguimiento, recordatorios y oportunidades.' },
    { title: 'Restaurantes', problem: 'Responder las mismas preguntas interrumpe la atención.', solution: 'Creamos una web informativa y flujos de WhatsApp para consultas y pedidos.' },
    { title: 'Academias', problem: 'Revisar matrículas en varias hojas toma trabajo manual.', solution: 'Construimos un sistema web de matrículas y automatizamos notificaciones.' },
  ],
  en: [
    { title: 'Hardware stores', problem: 'Purchases and sales leave stock records out of date.', solution: 'We adapt an ERP with inventory, purchasing and sales in one place.' },
    { title: 'Grocers and minimarkets', problem: 'Notebooks and loose spreadsheets make stock hard to check.', solution: 'We build a web system to record movements and check inventory.' },
    { title: 'Clinics and practices', problem: 'Appointments are scattered across messages and calendars.', solution: 'We build a web calendar and a WhatsApp chatbot to manage bookings.' },
    { title: 'Repair shops', problem: 'It is hard to track who is waiting for a reply or a quote.', solution: 'We adapt a CRM with follow-ups, reminders and opportunities.' },
    { title: 'Restaurants', problem: 'Answering repeated questions interrupts service.', solution: 'We build an information website and WhatsApp flows for questions and orders.' },
    { title: 'Academies', problem: 'Checking enrolments across spreadsheets takes manual work.', solution: 'We build a web enrolment system and automate notifications.' },
  ],
} as const;
export const smallTeam = {
  es: [
    { title: 'Trato directo', text: 'El responsable de tu proyecto participa en el desarrollo. Le explicas el problema y revisas los avances con él.' },
    { title: 'Propuesta por escrito', text: 'Antes de empezar acordamos alcance y costo. Sabes qué incluye la entrega y qué queda fuera.' },
    { title: 'Código y datos tuyos', text: 'El código que desarrollamos y tus datos son tuyos. Acordamos la entrega de accesos y distinguimos las herramientas de terceros.' },
    { title: 'Soporte después de entregar', text: 'Puedes contratar mantenimiento mensual con soporte, copias de seguridad, actualizaciones y pequeñas mejoras.' },
  ],
  en: [
    { title: 'Direct contact', text: 'Your project lead takes part in development. You explain the problem and review progress with them.' },
    { title: 'A written proposal', text: 'We agree on scope and cost before starting. You know what delivery includes and what falls outside it.' },
    { title: 'Your code and data', text: 'The code we develop and your data belong to you. We agree on access handover and identify third-party tools separately.' },
    { title: 'Support after delivery', text: 'You can choose monthly maintenance with support, backups, updates and small improvements.' },
  ],
} as const;
export const homeFaqs = {
  es: [
    { q: '¿Cómo es el diagnóstico gratis?', a: 'Conversamos durante 30 minutos sobre tu operación, el problema que quieres resolver y las herramientas que usas. Después definimos una propuesta con alcance y costo, sin compromiso.' },
    { q: '¿Qué necesito preparar?', a: 'Trae un ejemplo de la tarea que te cuesta resolver y cuenta quién la realiza. Puedes mostrar una hoja de Excel sin datos personales; no necesitas una especificación técnica.' },
    { q: '¿Puedo empezar pequeño?', a: 'Sí. Podemos delimitar una primera etapa que resuelva una tarea concreta. Dejamos por escrito lo que incluye y evaluamos las siguientes etapas por separado.' },
    { q: '¿Qué pasa con mis datos de Excel?', a: 'Revisamos tus archivos y sus columnas antes de proponer una importación. Acordamos qué datos trasladar y cómo validar el resultado; conserva una copia del original.' },
    { q: '¿Cómo pago y qué comprobante recibo?', a: 'Para proyectos, pagas la mitad al empezar y la otra mitad cuando funciona. Cada profesional emite recibo por honorarios electrónico. El mantenimiento es mensual y los costos de terceros se pagan aparte.' },
    { q: '¿Trabajan fuera de Trujillo?', a: 'Sí. Trabajamos de forma remota para todo el Perú y el extranjero. Revisamos avances y coordinamos reuniones en línea.' },
  ],
  en: [
    { q: 'What happens in the free discovery call?', a: 'We spend 30 minutes discussing your operation, the problem you want to solve and the tools you use. We then define a proposal with scope and cost, with no obligation.' },
    { q: 'What should I prepare?', a: 'Bring an example of the task you need help with and explain who does it. You can show a spreadsheet without personal data; no technical specification is needed.' },
    { q: 'Can I start small?', a: 'Yes. We can define a first stage that solves one specific task. We document what it includes and assess later stages separately.' },
    { q: 'What happens to my Excel data?', a: 'We review your files and columns before proposing an import. We agree on what to transfer and how to validate the result; keep a copy of the original.' },
    { q: 'How do I pay and what receipt do I get?', a: 'For projects, you pay half upfront and half when it works. Each professional issues an electronic fee receipt (recibo por honorarios). Maintenance is monthly and third-party costs are separate.' },
    { q: 'Do you work outside Trujillo?', a: 'Yes. We work remotely across Peru and abroad. We review progress and coordinate meetings online.' },
  ],
} as const;
