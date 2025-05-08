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
  const db = await openDB();
  const tx = db.transaction("requests", "readwrite");
  const store = tx.objectStore("requests");
  const allReq = await new Promise<any[]>((res, rej) => {
    const r = store.getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  for (const req of allReq) {
    try {
      const resp = await fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: req.headers,
      });
      if (resp.ok) store.delete(req.id);
    } catch {
      // on arrête si une requête échoue
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
