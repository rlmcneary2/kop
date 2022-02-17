import { FirebaseOptions } from "firebase/app";
import { Action } from "reshape-state";

interface AsyncRequest<T> {
  data?: T;
  error?: Error;
  status: "active" | "pending" | "complete";
}

export interface ContextActions {
  createDonor: (donor: Donor) => void;
  readDonors: (...args: Parameters<Datastore["readDonors"]>) => void;
  updateDonor: (donor: DatastoreObject<Donor>) => void;
}

export interface ContextData {
  donor?: AsyncRequest<Donor>;
  donors?: AsyncRequest<DatastoreObject<Donor>[]>;
  debounceActions?: DebounceAction[];
}

export interface ContextState extends ContextActions, ContextData {}

export interface Datastore {
  createDonor: (donor: Donor) => Promise<DatastoreObject<Donor>>;
  readDonors: (options?: {
    limit?: number;
    orderBy?: keyof Donor;
  }) => Promise<DatastoreObject<Donor>[]>;
  updateDonor: (donor: DatastoreObject<Donor>) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatastoreOptions
  extends Pick<FirebaseOptions, "apiKey" | "authDomain" | "storageBucket"> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DebounceAction<P = any> extends Action<Action<P>> {
  debounceId: string;
  timeout: number;
}

export interface Donor {
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export type DatastoreObject<T> = {
  [Name in keyof T]: T[Name];
} & {
  datastoreId: string;
};
