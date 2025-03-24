"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJobsFromFirebase = exports.fetchNewJobsFromFirebase = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../database/firebase");
const fetchNewJobsFromFirebase = async (lastVisibleId) => {
    console.log(`⏳ Fetching new jobs from Firestore...`);
    const jobsRef = (0, firestore_1.collection)(firebase_1.db, "jobs");
    let jobQuery = (0, firestore_1.query)(jobsRef, (0, firestore_1.orderBy)("createdAt", "desc"), (0, firestore_1.limit)(1000));
    if (lastVisibleId) {
        const lastDocSnapshot = await (0, firestore_1.getDoc)((0, firestore_1.doc)(jobsRef, lastVisibleId));
        if (lastDocSnapshot.exists()) {
            jobQuery = (0, firestore_1.query)(jobQuery, (0, firestore_1.startAfter)(lastDocSnapshot));
            console.log("📍 Fetching jobs **after**:", lastVisibleId);
        }
        else {
            console.warn(`⚠️ Last document ${lastVisibleId} not found in Firestore.`);
        }
    }
    const snapshot = await (0, firestore_1.getDocs)(jobQuery);
    if (snapshot.empty) {
        console.log("🚫 No more jobs found.");
        return { jobs: [], lastDoc: null };
    }
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
    const jobs = snapshot.docs.map((doc) => ({
        jobId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof firestore_1.Timestamp
            ? doc.data().createdAt
            : new firestore_1.Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
    }));
    return { jobs, lastDoc: newLastDoc };
};
exports.fetchNewJobsFromFirebase = fetchNewJobsFromFirebase;
const fetchJobsFromFirebase = async () => {
    console.log("⏳ Fetching first 1000 jobs from Firestore...");
    const jobsRef = (0, firestore_1.collection)(firebase_1.db, "jobs");
    const jobQuery = (0, firestore_1.query)(jobsRef, (0, firestore_1.orderBy)("createdAt", "desc"), (0, firestore_1.limit)(1000));
    const snapshot = await (0, firestore_1.getDocs)(jobQuery);
    if (snapshot.empty) {
        console.log("🚫 No jobs found in Firestore.");
        return { jobs: [], lastDoc: null };
    }
    // ✅ Get the last document in the snapshot for pagination
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    // ✅ Map Firestore documents to JobPosting objects
    const jobs = snapshot.docs.map((doc) => ({
        jobId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof firestore_1.Timestamp
            ? doc.data().createdAt
            : new firestore_1.Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
    }));
    console.log(`✅ Fetched ${jobs.length} jobs. Last visible doc ID: ${lastDoc.id}`);
    return { jobs, lastDoc };
};
exports.fetchJobsFromFirebase = fetchJobsFromFirebase;
//# sourceMappingURL=firebase-queries.js.map