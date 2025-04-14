import { openDB } from "idb";

const dbPromise = openDB("my-db", 1, {
  upgrade(db) {
    db.createObjectStore("users");
  },
});

export const saveUsersToCache = async (users: any) => {
  const db = await dbPromise;
  await db.put("users", users, "cached");
};

export const getUsersFromCache = async () => {
  const db = await dbPromise;
  return db.get("users", "cached");
};
