// Painel: app instalado (PWA). Recebe as notificações (Web Push) mesmo com o painel fechado, abre o pedido certo ao tocar
// e guarda a casca do painel para abrir sem internet (os pedidos em si vêm sempre do banco, nunca ficam guardados aqui).
// Vale só para o painel: /admin/ no site ou a raiz de painel.capstudio.com.br (o site dos clientes não é afetado).
const PAGINA = 'painel-pagina-v1';   // a página do painel (a última que abriu com internet)
const ARQUIVOS = 'painel-arquivos-v1'; // scripts, estilos, fontes e ícones do painel (nomes com código: nunca mudam)
const MAX_ARQUIVOS = 160;
// next dev (registrado com ?dev=1): os arquivos não têm código no nome, então nada é guardado
const DEV = new URL(self.location.href).searchParams.has('dev');

self.addEventListener('install', (e) => {
  self.skipWaiting();
  // já deixa a página guardada para a primeira vez sem internet
  if (!DEV) e.waitUntil(caches.open(PAGINA).then((c) => c.add(new Request(self.registration.scope, { cache: 'reload' }))).catch(() => {}));
});
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('painel-') && k !== PAGINA && k !== ARQUIVOS) await caches.delete(k);
  if (self.registration.navigationPreload) await self.registration.navigationPreload.enable().catch(() => {});
  await self.clients.claim();
})()));

const ehArquivo = (u) => u.pathname.startsWith('/_next/static/') || /^\/(icon\.png|apple-icon\.png|favicon\.ico)$/.test(u.pathname) || /^\/(admin\/)?(icon-|badge|atalhos\/)/.test(u.pathname);

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (DEV || req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // banco, fotos dos pedidos e WhatsApp passam direto

  // página: sempre da internet (versão nova na hora); sem internet, a última guardada
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const r = (await e.preloadResponse) || (await fetch(req));
        if (r.ok && r.type === 'basic') { const c = await caches.open(PAGINA); await c.put(self.registration.scope, r.clone()); }
        return r;
      } catch {
        const c = await caches.open(PAGINA);
        return (await c.match(self.registration.scope)) || new Response(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Painel</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0b0b;color:#f4f1ea;font:16px system-ui;text-align:center;padding:24px"><div><p style="font-size:22px;font-weight:700;margin:0 0 8px">Sem internet</p><p style="opacity:.6;margin:0 0 20px">O painel abre assim que a conexão voltar.</p><button onclick="location.reload()" style="font:inherit;font-weight:700;border:0;border-radius:99px;padding:12px 22px;background:#f4f1ea;color:#0b0b0b">Tentar de novo</button></div>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // arquivos do build: do aparelho primeiro (abre rápido), da internet quando ainda não tem
  if (ehArquivo(url)) {
    e.respondWith((async () => {
      const c = await caches.open(ARQUIVOS);
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok && r.type === 'basic') {
        await c.put(req, r.clone());
        const keys = await c.keys(); // não deixa crescer sem fim (cada publicação traz arquivos novos)
        for (const k of keys.slice(0, Math.max(0, keys.length - MAX_ARQUIVOS))) await c.delete(k);
      }
      return r;
    })());
  }
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'CapStudio', body: e.data ? e.data.text() : '' }; }
  const title = d.title || 'CapStudio';
  const opts = {
    body: d.body || '',
    icon: '/icon.png',
    badge: '/admin/badge.png',
    image: d.image,
    tag: d.tag,
    renotify: !!d.tag,
    timestamp: d.ts || Date.now(),
    // pedido novo e orçamento aprovado ficam na tela até alguém ver
    requireInteraction: d.kind === 'pedido' || d.kind === 'aprovado',
    vibrate: [120, 60, 120],
    actions: (d.actions || []).slice(0, 2),
    data: { url: d.url || '/admin/', whats: d.whats || '' },
  };
  e.waitUntil((async () => {
    await self.registration.showNotification(title, opts);
    // painel aberto: atualiza o sino e a lista na hora
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) c.postMessage({ tipo: 'push', aviso: d });
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const data = e.notification.data || {};
  if (e.action === 'whats' && data.whats) { e.waitUntil(self.clients.openWindow(data.whats)); return; }
  const url = new URL(data.url || '/admin/', self.location.origin).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const aberto = list.find((c) => c.url.startsWith(self.registration.scope));
    if (aberto) {
      await aberto.focus();
      aberto.postMessage({ tipo: 'abrir', url });
      return;
    }
    await self.clients.openWindow(url);
  })());
});
