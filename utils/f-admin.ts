import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { getApps, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";

const apps = getApps();

const app = !apps.length
  ? initializeApp({
      credential: credential.cert(
        JSON.parse(process.env.FIREBASE_ADMIN_CONFIG || "{}")
      ),
      storageBucket: process.env.FIREBASE_BUCKET,
    })
  : apps[0];

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
