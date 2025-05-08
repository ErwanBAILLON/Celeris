export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("offline-requests", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("requests")) {
        db.createObjectStore("requests", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeOfflineRequest(url: string, body: string, method: string, headers: HeadersInit) {
  const db = await openDB();
  const tx = db.transaction('requests', 'readwrite');
  tx.objectStore('requests').add({ url, body, method, headers, timestamp: new Date().toISOString() });
}

export async function syncOfflineRequests() {
  if (!navigator.onLine) return;
  const expirationTime = 24 * 60 * 60 * 1000; // 1 day in ms
  const now = Date.now();
  const db = await openDB();
  // Obtenir toutes les requêtes depuis une transaction de lecture seule
  const allReq = await new Promise<any[]>((res, rej) => {
    const tx = db.transaction("requests", "readonly");
    const store = tx.objectStore("requests");
    const r = store.getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  console.log("Syncing offline requests:", allReq);
  if (allReq.length === 0) return;
  for (const req of allReq) {
    // Si la requête est expirée, supprimer via une transaction nouvelle
    if (now - new Date(req.timestamp).getTime() > expirationTime) {
      const txDel = db.transaction("requests", "readwrite");
      txDel.objectStore("requests").delete(req.id);
      await new Promise(resolve => { txDel.oncomplete = resolve; });
      continue;
    }
    try {
      const resp = await fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: req.headers,
      });
      console.log("Offline request sent:", req);
      console.log("Response:", resp);
      if (resp.ok) {
        // Supprimer la requête synchronisée avec une nouvelle transaction
        const txDel = db.transaction("requests", "readwrite");
        txDel.objectStore("requests").delete(req.id);
        await new Promise(resolve => { txDel.oncomplete = resolve; });
        console.log("Request deleted from store:", req.id);
      } else {
        console.error("Failed to sync request:", req, resp);
      }
    } catch (error) {
      console.error("Error syncing request:", error);
      break;
    }
  }
}

export async function fetchWithOfflineSupport(url: string, options: RequestInit) {
  const { method = 'GET', body = null, headers = {} } = options;
  if (navigator.onLine) {
    return fetch(url, options);
  } else if (method !== 'GET') {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    await storeOfflineRequest(url, bodyStr, method, headers as HeadersInit);
    return new Response(JSON.stringify({ offline: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return fetch(url, options);
  }
}
