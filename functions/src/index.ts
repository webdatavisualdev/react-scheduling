import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestoreDB = admin.firestore();

export const createUser = functions.https.onCall(async (data, context) => {
  await firestoreDB.collection('users').doc(data.uid).set({
    ...data,
    createdAt: new Date().getTime(),
  });
  return { success: true };
});

export const setAppointment = functions.https.onCall(async (data, context) => {
  const res = await firestoreDB.collection('appointments').add({
    createdAt: new Date().getTime(),
    start: data.start,
    end: data.end,
    userId: data.uid,
    otherUser: data.email,
    accepted: false,
  });
  return { success: true, id: res.id };
});

export const getAppointments = functions.https.onCall(async (data, context) => {
  const appointmentsDocs = await firestoreDB.collection('appointments').where('userId', '==', data).get();
  let appointments: any[] = [];
  appointmentsDocs.forEach(doc => {
    appointments.push({...doc.data(), id: doc.id});
  });
  return { 
    success: true,
    appointments,
  };
});

export const getInvitedAppointments = functions.https.onCall(async (data, context) => {
  const appointmentsDocs = await firestoreDB.collection('appointments').where('otherUser', '==', data).get();
  let appointments: any[] = [];
  appointmentsDocs.forEach(doc => {
    appointments.push({...doc.data(), id: doc.id});
  });
  return { 
    success: true,
    appointments,
  };
});

export const getAppointment = functions.https.onCall(async (data, context) => {
  const doc = await firestoreDB.collection('appointments').doc(data).get();
  return { 
    success: true,
    data: doc.data(),
  };
});

export const handleAppointment = functions.https.onCall(async (data, context) => {
  const res = await firestoreDB.collection('appointments').doc(data.id).get();
  if (res.id) {
    if (data.status) {
      await firestoreDB.collection('appointments').doc(data.id).set({
        accepted: true,
      }, {merge: true});
    } else {
      await firestoreDB.collection('appointments').doc(data.id).delete();
    }
    return {
      success: true,
    }
  }
  return { 
    success: false,
    message: 'Appointment doesn\'nt exist',
  };
});