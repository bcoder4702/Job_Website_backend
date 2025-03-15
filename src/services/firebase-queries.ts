import { JobPosting } from "../models/jobPosting";
import { QueryDocumentSnapshot, DocumentData, collection, query, orderBy, limit, getDoc, doc, startAfter, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../database/firebase";




export const fetchNewJobsFromFirebase = async (lastVisibleId: string | null): Promise<{ jobs: JobPosting[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  console.log(`⏳ Fetching new jobs from Firestore...`);

  const jobsRef = collection(db, "jobs");

  let jobQuery = query(
    jobsRef,
    orderBy("createdAt", "desc"), 
    limit(1000) 
  );

  if (lastVisibleId) {
    const lastDocSnapshot = await getDoc(doc(jobsRef, lastVisibleId));
    if (lastDocSnapshot.exists()) {
      jobQuery = query(jobQuery, startAfter(lastDocSnapshot));
      console.log("📍 Fetching jobs **after**:", lastVisibleId);
    } else {
      console.warn(`⚠️ Last document ${lastVisibleId} not found in Firestore.`);
    }
  }

  const snapshot = await getDocs(jobQuery);

  if (snapshot.empty) {
    console.log("🚫 No more jobs found.");
    return { jobs: [], lastDoc: null };
  }

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

  const jobs = snapshot.docs.map((doc) => ({
    jobId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt instanceof Timestamp 
      ? doc.data().createdAt 
      : new Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
  })) as JobPosting[];

  return { jobs, lastDoc: newLastDoc };
}


export const fetchJobsFromFirebase = async(): Promise<{ jobs: JobPosting[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }>  =>{
    console.log("⏳ Fetching first 1000 jobs from Firestore...");
  
    const jobsRef = collection(db, "jobs");
    const jobQuery = query(jobsRef, orderBy("createdAt", "desc"), limit(1000));
  
    const snapshot = await getDocs(jobQuery);
  
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
      createdAt: doc.data().createdAt instanceof Timestamp 
        ? doc.data().createdAt 
        : new Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
    })) as JobPosting[];
  
    console.log(`✅ Fetched ${jobs.length} jobs. Last visible doc ID: ${lastDoc.id}`);
  
    return { jobs, lastDoc };
  }