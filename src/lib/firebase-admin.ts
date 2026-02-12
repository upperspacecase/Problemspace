import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;
let auth: Auth;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  return app;
}

export function getAdminAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getAdminApp());
  return auth;
}
