import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  Query,
  query,
  QueryConstraint,
  updateDoc
} from "firebase/firestore";
import {
  Datastore,
  DatastoreOptions,
  DatastoreObject,
  Donor
} from "../type/type";

export function dataStore(options: DatastoreOptions): Readonly<Datastore> {
  return Object.freeze(getFirestoreDatastore(options));
}

let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;

function getFirestoreDatastore({
  apiKey,
  authDomain,
  storageBucket
}: DatastoreOptions): Datastore {
  if (!firebaseApp) {
    const firebaseConfig: FirebaseOptions = {
      apiKey,
      appId: "1:916726978427:web:67de5e0be6c8347fad8fde",
      authDomain,
      messagingSenderId: "916726978427",
      projectId: "kop-ds",
      storageBucket
    };

    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!firestore) {
    firestore = getFirestore(firebaseApp);
  }

  if (!firestore) {
    throw Error("Failed to get access to Firestore.");
  }

  const store = firestore;

  return {
    createDonor: async donor => {
      const query = collection(store, "donor");
      const result = await addDoc(query, donor);
      console.log("createDonor: result=", result);
      return { ...donor, datastoreId: result.id, foo: 1 };
    },
    readDonors: async options => {
      const queryArgs: [query: Query, ...constraints: QueryConstraint[]] = [
        collection(store, "donor")
      ];

      if (options?.limit) {
        queryArgs.push(limit(options.limit));
      }

      if (options?.orderBy) {
        queryArgs.push(orderBy(options.orderBy));
      }

      const q = query(...queryArgs);
      const result = await getDocs(q);
      console.log("readDonors: result=", result);
      return result.docs.map(
        doc =>
          ({ ...doc.data(), datastoreId: doc.id } as DatastoreObject<Donor>)
      );
    },
    updateDonor: async donor => {
      const ref = doc(store, "donor", donor.datastoreId);
      await updateDoc(ref, cleanObjectBeforeUpdate(donor));
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanObjectBeforeUpdate<T extends object>(data: DatastoreObject<T>) {
  return Object.entries(data).reduce((acc, [name, value]) => {
    if (typeof value === "undefined" || value === null) {
      return acc;
    }

    if (name === "datastoreId") {
      return acc;
    }

    return { ...acc, [name]: value };
  }, {});
}
