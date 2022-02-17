import { ActionHandler } from "reshape-state";
import {
  ContextData,
  Datastore,
  DatastoreObject,
  DatastoreOptions,
  DebounceAction,
  Donor
} from "../../type/type";
import { dataStore } from "../data-store";
import { debounceActions } from "./debounce-handlers";

export function createDonorHandlers(
  options: DatastoreOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ActionHandler<ContextData | null, any>[] {
  const store = dataStore(options);
  const ACTION_UPDATE_DONOR_DATASTORE = "update-donor-datastore";

  const createDonor: ActionHandler<ContextData | null, Donor> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== donorActions.CREATE_DONOR || !action.payload) {
      return [state];
    }

    if (
      state?.donor?.status === "pending" ||
      state?.donor?.status === "active"
    ) {
      return [state];
    }

    store
      .createDonor(action.payload)
      .then(result =>
        dispatch(inlineState => {
          console.log("createDonor: result=", result);
          if (!inlineState) {
            return [inlineState];
          }

          const nextState: ContextData = {
            ...inlineState,
            donor: { status: "complete" }
          };

          nextState.donors = nextState.donors ?? { status: "complete" };
          nextState.donors.data = nextState.donors.data ?? [];
          action.payload && nextState.donors.data.push(result);

          return [nextState, true];
        })
      )
      .catch(error =>
        dispatch(inlineState => [
          { ...inlineState, donor: { error, status: "complete" } },
          true
        ])
      );

    const nextState = { ...(state ?? {}) };
    nextState.donor = { status: "pending" };

    return [state];
  };

  const readDonors: ActionHandler<
    ContextData | null,
    Parameters<Datastore["readDonors"]>[0]
  > = (state, action, dispatch) => {
    if (action.id !== donorActions.READ_DONORS) {
      return [state];
    }

    if (
      state?.donors?.status === "pending" ||
      state?.donors?.status === "active"
    ) {
      return [state];
    }

    store
      .readDonors(action.payload)
      .then(result =>
        dispatch(inlineState => [
          {
            ...inlineState,
            donors: { data: result, status: "complete" }
          },
          true
        ])
      )
      .catch(error =>
        dispatch(inlineState => [
          { ...inlineState, donors: { error, status: "complete" } },
          true
        ])
      );

    const nextState = { ...(state ?? {}) };
    nextState.donors = { status: "pending" };

    return [nextState, true];
  };

  const updateDonor: ActionHandler<
    ContextData | null,
    DatastoreObject<Donor>
  > = (state, action, dispatch) => {
    if (action.id !== donorActions.UPDATE_DONOR || !state || !action.payload) {
      return [state];
    }

    const { payload: donor } = action;

    const debounceAction: DebounceAction<DatastoreObject<Donor>> = {
      debounceId: `${donor.datastoreId}_${donorActions.UPDATE_DONOR}`,
      id: debounceActions.DEBOUNCE,
      timeout: UPDATE_DONOR_TIMEOUT,
      payload: { id: ACTION_UPDATE_DONOR_DATASTORE, payload: donor }
    };

    dispatch(debounceAction);

    const { donors } = state;
    if (!donors?.data) {
      return [state];
    }

    state.donors = {
      ...donors,
      data: donors.data.map(item =>
        item.datastoreId === donor.datastoreId ? donor : item
      )
    };

    return [state, true];
  };

  const updateDonorDatastore: ActionHandler<
    ContextData | null,
    DatastoreObject<Donor>
  > = (state, action, dispatch) => {
    if (
      action.id !== ACTION_UPDATE_DONOR_DATASTORE ||
      !state ||
      !action.payload
    ) {
      return [state];
    }

    store
      .updateDonor(action.payload)
      .then(result => console.log("updateDonorDatastore: result=", result))
      .catch(error => console.error("updateDonorDatastore: error=", error));

    return [state];
  };

  return [createDonor, readDonors, updateDonor, updateDonorDatastore];
}

const UPDATE_DONOR_TIMEOUT = 3000;

export const donorActions = Object.freeze({
  CREATE_DONOR: "create-donor",
  READ_DONORS: "read-donors",
  UPDATE_DONOR: "update-donor"
});
