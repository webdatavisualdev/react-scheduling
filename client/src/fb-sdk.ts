import firebase from "firebase/app";
import 'firebase/functions';
import { IEvent } from './pages/SetAppointment';

const firebaseConfig = {
  apiKey: "AIzaSyA26s0tYY6HDza1_dbvgG4DJDQcMPaV71s",
  authDomain: "react-scheduling.firebaseapp.com",
  projectId: "react-scheduling",
  storageBucket: "react-scheduling.appspot.com",
  messagingSenderId: "807210618540",
  appId: "1:807210618540:web:12e9b79d24a5762e949909",
  measurementId: "G-RWEY8R30KL"
};

const app = firebase.initializeApp(firebaseConfig);

const firebaseFunctions = app.functions();
firebaseFunctions.useEmulator('localhost', 5001);

export async function createUser(user: any) {
  const { email, displayName, emailVerified, uid } = user;
  return firebaseFunctions.httpsCallable('createUser')({
    email,
    displayName,
    emailVerified,
    uid,
  });
}

export async function setAppointment(event: IEvent) {
  return firebaseFunctions.httpsCallable('setAppointment')(event);
}

export async function getAppointments(uid: string) {
  return firebaseFunctions.httpsCallable('getAppointments')(uid);
}

export async function getInvitedAppointments(email: string) {
  return firebaseFunctions.httpsCallable('getInvitedAppointments')(email);
}

export async function getAppointment(id: string) {
  return firebaseFunctions.httpsCallable('getAppointment')(id);
}

export async function handleAppointment(status: boolean, id: string) {
  return firebaseFunctions.httpsCallable('handleAppointment')({
    status,
    id
  });
}

export default app;
