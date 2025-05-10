import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';

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

export async function storeOfflineRequest(
  url: string,
  body: string,
  method: string,
  headers: HeadersInit,
  localId?: string
) {
  const db = await openDB();
  const tx = db.transaction('requests', 'readwrite');
  tx.objectStore('requests').add({ url, body, method, headers, timestamp: new Date().toISOString(), localId });
}

export async function getOfflineRequests() {
  const db = await openDB();
  const data = await new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction("requests", "readonly");
    const store = tx.objectStore("requests");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  console.log("Offline requests:", data);
  return data
}

export const purgeExpiredRequests = async () => {
  const db = await openDB();
  const tx = db.transaction("requests", "readwrite");
  const store = tx.objectStore("requests");
  const now = Date.now();
  const expirationTime = 60 * 1000; // 1 day in ms
  const req = store.openCursor();
  req.onsuccess = () => {
    const cursor = req.result;
    if (cursor) {
      const request = cursor.value;
      if (now - new Date(request.timestamp).getTime() > expirationTime) {
        store.delete(request.id);
        // extract title from JSON body string
        let title = "";
        try {
          const bodyObj = JSON.parse(request.body);
          title = bodyObj.title || "";
        } catch {}
        generateNotication(request.method, `La requête ${title} a expiré.`);
      }
      cursor.continue();
    }
  };
  req.onerror = () => {
    console.error("Error purging expired requests:", req.error);
  };
  await new Promise(resolve => { tx.oncomplete = resolve; });
};

const generateNotication = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', message: string) => {
  if (Notification.permission === 'granted') {
    new Notification(`Requête ${method}`, {
      body: `${message}`,
      icon: '/icon.png',
    });
  } else {
    alert(`Statut réseau: ${message}`);
  }
};

export async function syncOfflineRequests() {
  if (!navigator.onLine) return;
  const expirationTime =  60 * 1000; // 1 day in ms
  const now = Date.now();
  const db = await openDB();

  const allReq = await new Promise<any[]>((res, rej) => {
    const tx = db.transaction("requests", "readonly");
    const store = tx.objectStore("requests");
    const r = store.getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });

  if (allReq.length === 0) return;

  for (const req of allReq) {
    // Si la requête est expirée, supprimer via une transaction nouvelle
    if (now - new Date(req.timestamp).getTime() > expirationTime) {
      const txDel = db.transaction("requests", "readwrite");
      txDel.objectStore("requests").delete(req.id);
      // extract title from JSON body string
      let title = "";
      try {
        const bodyObj = JSON.parse(req.body);
        title = bodyObj.title || "";
      } catch {}
      generateNotication(req.method, `La requête ${title} a expiré.`);
      await new Promise(resolve => { txDel.oncomplete = resolve; });
      continue;
    }

    try {
      const resp = await fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: req.headers,
      });

      if (resp.ok) {
        const txDel = db.transaction("requests", "readwrite");
        txDel.objectStore("requests").delete(req.id);

        // si c'est la création d'un project, remplacer le temp par le réel
        if (req.method === 'POST' && req.url.includes('/projects')) {
          const created = await resp.json();
          const { removeProject, addProject } = useProjectStore.getState();
          if (req.localId) removeProject(req.localId);
          addProject(created);
        }

        if (req.method === 'POST' && req.url.includes('/tasks')) {
          const created = await resp.json();
          const { removeTask, addTask } = useTaskStore.getState();
          if (req.localId) removeTask(req.localId);
          addTask(created);
        }
        if (req.method === 'PUT' && req.url.includes('/tasks')) {
          const created = await resp.json();
          const { removeTask, addTask } = useTaskStore.getState();
          if (req.localId) removeTask(req.localId);
          addTask(created);
        }
        if (req.method === 'PUT' && req.url.includes('/projects')) {
          const created = await resp.json();
          const { removeProject, addProject } = useProjectStore.getState();
          if (req.localId) removeProject(req.localId);
          addProject(created);
        }
        if (req.method === 'DELETE' && req.url.includes('/projects')) {
          const { removeProject } = useProjectStore.getState();
          if (req.localId) removeProject(req.localId);
        }

        generateNotication(req.method, `La requête a été synchronisée.`);
        await new Promise(resolve => { txDel.oncomplete = resolve; });
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
