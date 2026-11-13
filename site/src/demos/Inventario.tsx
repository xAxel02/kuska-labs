/** @jsxImportSource preact */
/**
 * Demo 2 · Control de inventario para una ferretería.
 * Stock con alertas, registro de ventas/entradas con validación, pedido al proveedor
 * y reportes (ventas de 7 días en "barras tejidas", productos más vendidos).
 * Datos ficticios en localStorage.
 */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { load, save, clear, isoDay, addDays, uid } from './store';

type Lang = 'es' | 'en';
type Product = { id: string; name: string; unit: string; stock: number; min: number; cost: number; price: number };
type Move = { id: string; day: string; productId: string; type: 'in' | 'out'; qty: number };
type Data = { products: Product[]; moves: Move[] };

const KEY = 'inventario-v1';

const T = {
  es: {
    business: 'Ferretería El Constructor',
    tabStock: 'Inventario', tabReports: 'Reportes', reset: 'Reiniciar demo',
    search: 'Buscar producto', product: 'Producto', stock: 'Stock', min: 'Mínimo', price: 'Precio', state: 'Estado',
    low: 'Reponer', ok: 'OK', register: 'Registrar movimiento', type: 'Tipo', sale: 'Venta', entry: 'Entrada (compra)', qty: 'Cantidad',
    save: 'Guardar', needQty: 'Escribe una cantidad mayor que cero.', notEnough: (n: number, u: string) => `Solo hay ${n} ${u} en stock.`,
    savedSale: (q: number, u: string, p: string) => `Venta registrada: ${q} ${u} de ${p}.`, savedEntry: (q: number, u: string, p: string) => `Entrada registrada: ${q} ${u} de ${p}.`,
    alerts: 'Productos por reponer', noAlerts: 'Todo el stock está sobre el mínimo.', order: 'Generar pedido al proveedor',
    orderTitle: 'Pedido listo para enviar al proveedor por WhatsApp:', orderHead: 'Hola, quisiera hacer el siguiente pedido:',
    kValue: 'Valor del inventario (costo)', kLow: 'Productos bajo mínimo', kToday: 'Ventas de hoy', kWeek: 'Ventas de 7 días',
    salesChart: 'Ventas de los últimos 7 días', top: 'Más vendidos (7 días)', units: 'unid.', empty: 'No hay productos que coincidan.',
    money: (n: number) => `S/ ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    dow: (d: Date) => d.toLocaleDateString('es-PE', { weekday: 'short' }),
    products: [
      ['Cemento Sol 42.5 kg', 'bolsas', 38, 20, 26, 32], ['Tubo PVC 1/2" x 5 m', 'unid.', 6, 15, 8, 12], ['Pintura látex blanca 4 L', 'galones', 21, 10, 45, 62],
      ['Fierro corrugado 3/8"', 'varillas', 3, 25, 22, 29], ['Clavos 2" (kg)', 'kg', 54, 20, 6, 9], ['Llave de paso 1/2"', 'unid.', 12, 8, 14, 22],
      ['Cinta aislante', 'unid.', 40, 15, 2, 4], ['Ladrillo King Kong', 'millares', 4, 3, 780, 950],
    ] as [string, string, number, number, number, number][],
  },
  en: {
    business: "Builder's Hardware",
    tabStock: 'Inventory', tabReports: 'Reports', reset: 'Reset demo',
    search: 'Search products', product: 'Product', stock: 'Stock', min: 'Minimum', price: 'Price', state: 'Status',
    low: 'Restock', ok: 'OK', register: 'Record a movement', type: 'Type', sale: 'Sale', entry: 'Restock (purchase)', qty: 'Quantity',
    save: 'Save', needQty: 'Enter a quantity greater than zero.', notEnough: (n: number, u: string) => `Only ${n} ${u} left in stock.`,
    savedSale: (q: number, u: string, p: string) => `Sale recorded: ${q} ${u} of ${p}.`, savedEntry: (q: number, u: string, p: string) => `Restock recorded: ${q} ${u} of ${p}.`,
    alerts: 'Items to restock', noAlerts: 'All stock is above the minimum.', order: 'Create supplier order',
    orderTitle: 'Order ready to send to your supplier on WhatsApp:', orderHead: "Hi, I'd like to place the following order:",
    kValue: 'Inventory value (cost)', kLow: 'Items below minimum', kToday: 'Sales today', kWeek: '7-day sales',
    salesChart: 'Sales over the last 7 days', top: 'Best sellers (7 days)', units: 'units', empty: 'No matching products.',
    money: (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    dow: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' }),
    products: [
      ['Portland cement 94 lb', 'bags', 38, 20, 8, 11], ['PVC pipe 1/2" x 10 ft', 'units', 6, 15, 3, 5], ['White latex paint 1 gal', 'gallons', 21, 10, 15, 22],
      ['Rebar #3 (3/8")', 'bars', 3, 25, 7, 10], ['Nails 2" (lb)', 'lb', 54, 20, 2, 4], ['Shut-off valve 1/2"', 'units', 12, 8, 5, 8],
      ['Electrical tape', 'units', 40, 15, 1, 2], ['Red clay bricks (pallet)', 'pallets', 4, 3, 260, 320],
    ] as [string, string, number, number, number, number][],
  },
};
type TDict = (typeof T)['es'];

function seed(lang: Lang): Data {
  const products: Product[] = T[lang].products.map(([name, unit, stock, min, cost, price], i) => ({ id: `p${i}`, name, unit, stock, min, cost, price }));
  // Ventas de los últimos 6 días (y algunas de hoy), con tendencia al alza
  const moves: Move[] = [];
  const today = new Date();
  for (let back = 6; back >= 0; back--) {
    const day = isoDay(addDays(today, -back));
    const n = back === 0 ? 3 : 5 + (6 - back);
    for (let k = 0; k < n; k++) {
      const p = products[(k * 3 + back) % products.length];
      moves.push({ id: uid(), day, productId: p.id, type: 'out', qty: 1 + ((k + back) % 4) });
    }
  }
  return { products, moves };
}

export default function Inventario({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<'stock' | 'reports'>('stock');

  useEffect(() => { setData(load<Data>(`${KEY}-${lang}`, () => seed(lang))); }, []);
  useEffect(() => { if (data) save(`${KEY}-${lang}`, data); }, [data]);

  if (!data) return <div class="dm-app" style="min-height:420px" aria-busy="true" />;
  const reset = () => { clear(`${KEY}-${lang}`); setData(seed(lang)); };

  return (
    <div class="dm-app">
      <div class="dm-bar">
        <span class="dm-brand"><i aria-hidden="true">EC</i>{t.business}</span>
        <div class="dm-tabs" role="tablist">
          <button role="tab" id="inv-tab-stock" aria-controls="inv-panel" aria-selected={tab === 'stock'} onClick={() => setTab('stock')}>{t.tabStock}</button>
          <button role="tab" id="inv-tab-reports" aria-controls="inv-panel" aria-selected={tab === 'reports'} onClick={() => setTab('reports')}>{t.tabReports}</button>
        </div>
        <button class="dm-btn ghost" onClick={reset}>{t.reset}</button>
      </div>
      <div class="dm-body" id="inv-panel" role="tabpanel" aria-labelledby={tab === 'stock' ? 'inv-tab-stock' : 'inv-tab-reports'}>
        {tab === 'stock' ? <Stock t={t} data={data} setData={setData} /> : <Reports t={t} data={data} />}
      </div>
    </div>
  );
}

function Stock({ t, data, setData }: { t: TDict; data: Data; setData: (d: Data) => void }) {
  const [q, setQ] = useState('');
  const [productId, setProductId] = useState(data.products[0].id);
  const [type, setType] = useState<'out' | 'in'>('out');
  const [qty, setQty] = useState('1');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [order, setOrder] = useState<string | null>(null);

  const list = data.products.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));
  const low = data.products.filter((p) => p.stock < p.min);

  const submit = (e: Event) => {
    e.preventDefault();
    const n = Math.floor(Number(qty));
    const p = data.products.find((x) => x.id === productId)!;
    if (!n || n <= 0) return setMsg({ ok: false, text: t.needQty });
    if (type === 'out' && n > p.stock) return setMsg({ ok: false, text: t.notEnough(p.stock, p.unit) });
    setData({
      products: data.products.map((x) => (x.id === p.id ? { ...x, stock: x.stock + (type === 'in' ? n : -n) } : x)),
      moves: [...data.moves, { id: uid(), day: isoDay(new Date()), productId: p.id, type, qty: n }],
    });
    setMsg({ ok: true, text: (type === 'out' ? t.savedSale : t.savedEntry)(n, p.unit, p.name) });
    setQty('1');
  };

  const makeOrder = () => {
    const lines = low.map((p) => `• ${p.name}: ${p.min * 2 - p.stock} ${p.unit}`);
    setOrder([t.orderHead, ...lines].join('\n'));
  };

  return (
    <div class="inv-layout">
      <div class="dm-grid">
        <div class="dm-field">
          <label for="inv-search">{t.search}</label>
          <input id="inv-search" class="dm-input" type="search" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
        </div>
        <div class="dm-table-wrap">
          <table class="dm-table">
            <thead>
              <tr><th>{t.product}</th><th class="num">{t.stock}</th><th class="num">{t.min}</th><th class="num">{t.price}</th><th>{t.state}</th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr class={p.stock < p.min ? 'low' : ''}>
                  <td style="color:var(--color-text)">{p.name}</td>
                  <td class="num">{p.stock} <span class="dm-muted">{p.unit}</span></td>
                  <td class="num">{p.min}</td>
                  <td class="num">{t.money(p.price)}</td>
                  <td>{p.stock < p.min ? <span class="dm-badge warn">{t.low}</span> : <span class="dm-badge ok">{t.ok}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p class="dm-muted" style="padding:0.75rem 0">{t.empty}</p>}
        </div>
      </div>

      <div class="dm-grid" style="align-content:start">
        <form class="dm-panel dm-grid" onSubmit={submit} noValidate>
          <h2>{t.register}</h2>
          <div class="dm-field">
            <label for="inv-product">{t.product}</label>
            <select id="inv-product" class="dm-input" value={productId} onChange={(e) => { setProductId((e.target as HTMLSelectElement).value); setMsg(null); }}>
              {data.products.map((p) => <option value={p.id}>{p.name} ({p.stock})</option>)}
            </select>
          </div>
          <div class="dm-field">
            <span class="dm-label">{t.type}</span>
            <div class="dm-chips" role="group" aria-label={t.type}>
              <button type="button" class="dm-chip" aria-pressed={type === 'out'} onClick={() => setType('out')}>{t.sale}</button>
              <button type="button" class="dm-chip" aria-pressed={type === 'in'} onClick={() => setType('in')}>{t.entry}</button>
            </div>
          </div>
          <div class="dm-field">
            <label for="inv-qty">{t.qty}</label>
            <input id="inv-qty" class="dm-input" type="number" min="1" step="1" inputMode="numeric" value={qty} onInput={(e) => { setQty((e.target as HTMLInputElement).value); setMsg(null); }} />
          </div>
          {msg && <p class={msg.ok ? 'dm-toast' : 'dm-error'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
          <div><button type="submit" class="dm-btn primary">{t.save}</button></div>
        </form>

        <div class="dm-panel">
          <h2>{t.alerts}</h2>
          {low.length === 0 ? <p class="dm-muted">{t.noAlerts}</p> : (
            <>
              <ul class="inv-alerts">
                {low.map((p) => <li><span>{p.name}</span><span class="dm-badge warn">{p.stock} / {p.min}</span></li>)}
              </ul>
              <button class="dm-btn" style="margin-top:0.75rem" onClick={makeOrder}>{t.order}</button>
              {order && (
                <div style="margin-top:0.75rem" role="status">
                  <p class="dm-muted" style="margin-bottom:0.5rem">{t.orderTitle}</p>
                  <p class="wa-bubble" style="white-space:pre-line">{order}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Reports({ t, data }: { t: TDict; data: Data }) {
  const today = new Date();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)), []);
  const priceOf = (id: string) => data.products.find((p) => p.id === id)?.price ?? 0;
  const salesBy = (day: string) => data.moves.filter((m) => m.type === 'out' && m.day === day).reduce((s, m) => s + m.qty * priceOf(m.productId), 0);
  const series = days.map((d) => salesBy(isoDay(d)));
  const window7 = new Set(days.map(isoDay));
  const max = Math.max(...series, 1);
  const value = data.products.reduce((s, p) => s + p.stock * p.cost, 0);
  const low = data.products.filter((p) => p.stock < p.min).length;
  const week = series.reduce((a, b) => a + b, 0);

  const top = data.products
    .map((p) => ({ p, units: data.moves.filter((m) => m.type === 'out' && m.productId === p.id && window7.has(m.day)).reduce((s, m) => s + m.qty, 0) }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 4);

  return (
    <div class="dm-grid">
      <div class="dm-kpis">
        <div class="dm-kpi"><span>{t.kValue}</span><strong>{t.money(value)}</strong></div>
        <div class={`dm-kpi ${low ? 'warn' : ''}`}><span>{t.kLow}</span><strong>{low}</strong></div>
        <div class="dm-kpi gold"><span>{t.kToday}</span><strong>{t.money(series[6])}</strong></div>
        <div class="dm-kpi"><span>{t.kWeek}</span><strong>{t.money(week)}</strong></div>
      </div>
      <div class="dm-grid two">
        <div class="dm-panel">
          <h2>{t.salesChart}</h2>
          <div class="dm-woven" role="img" aria-label={`${t.salesChart}: ${series.map((v, i) => `${t.dow(days[i])} ${t.money(v)}`).join(', ')}`}>
            {series.map((v) => (
              <span class="col">{Array.from({ length: Math.max(1, Math.round((v / max) * 12)) }).map(() => <b />)}</span>
            ))}
          </div>
          <div class="dm-woven-labels" aria-hidden="true">{days.map((d) => <span>{t.dow(d)}</span>)}</div>
        </div>
        <div class="dm-panel">
          <h2>{t.top}</h2>
          <ol class="inv-top">
            {top.map(({ p, units }) => <li><span>{p.name}</span><strong>{units} {t.units}</strong></li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}
