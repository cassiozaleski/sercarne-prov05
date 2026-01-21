// --- INSERIR DENTRO DE `export const schlosserApi = { ... }` ---

async _getReservationsApi() {
  const cached = this._getReservationsCache();
  if (cached) return cached;

  try {
    const res = await fetch('/api/reservas', { method: 'GET' });
    const json = await res.json();
    const data = (json && json.ok && Array.isArray(json.reservations)) ? json.reservations : [];
    this._setReservationsCache(data);
    return data;
  } catch (e) {
    console.warn('Falha ao buscar reservas via API, usando fallback local.', e);
    return [];
  }
},

async confirmOrder(orderId, token = null) {
  if (!orderId) throw new Error('orderId é obrigatório');
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm', orderId, token })
    });
    const out = await res.json();
    if (!out?.ok) throw new Error(out?.error || 'Falha ao confirmar pedido');
    return out;
  } catch (e) {
    console.error('confirmOrder error', e);
    throw e;
  }
},

async cancelOrder(orderId) {
  if (!orderId) throw new Error('orderId é obrigatório');
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', orderId })
    });
    const out = await res.json();
    if (out?.ok) return { success: true, server: true, out };
    // se server respondeu sem ok, seguiremos para fallback local
  } catch (e) {
    console.warn('cancelOrder: falha ao chamar server - fallback local', e);
  }

  // Fallback local: marca pedido local como CANCELADO (UX)
  try {
    const existing = JSON.parse(localStorage.getItem('schlosser_client_orders') || '[]');
    const updated = existing.map(o => (String(o.id) === String(orderId) ? { ...o, status: 'CANCELADO' } : o));
    localStorage.setItem('schlosser_client_orders', JSON.stringify(updated));
    return { success: true, local: true };
  } catch (e) {
    console.error('cancelOrder fallback error', e);
    return { success: false, error: e.message };
  }
},

async getOrders(role = 'public', key = null, filters = {}) {
  try {
    const localKey = role && String(role).toLowerCase().includes('vendor') ? 'schlosser_vendor_orders' : 'schlosser_client_orders';
    const local = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (local && local.length) {
      return local;
    }

    // Tentativa de consultar o servidor (se existir endpoint GET /api/orders)
    try {
      const res = await fetch('/api/orders', { method: 'GET' });
      if (res.ok) {
        const out = await res.json();
        if (out?.ok && Array.isArray(out.orders)) return out.orders;
      }
    } catch (e) {
      // fallback vazio
    }

    return [];
  } catch (e) {
    console.error('getOrders error', e);
    return [];
  }
},
