-- Leads recibidos desde el formulario de contacto
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  name        TEXT    NOT NULL,
  contact     TEXT    NOT NULL,
  business    TEXT,
  message     TEXT    NOT NULL,
  lang        TEXT    NOT NULL DEFAULT 'es',
  country     TEXT,
  user_agent  TEXT,
  email_sent  INTEGER,            -- 1 = correo enviado, 0 = falló (revisar a mano)
  status      TEXT    NOT NULL DEFAULT 'nuevo'  -- nuevo · contactado · propuesta · cerrado
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
