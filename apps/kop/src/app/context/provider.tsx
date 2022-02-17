import React, { useEffect, useMemo } from "react";
import {
  ContextActions,
  ContextState,
  DebounceAction,
  Donor
} from "../type/type";
import { Context } from "./context";
import { useReshapeState } from "./use-reshape-state";
import { donorActions } from "../context/handlers";

export function ContextProvider({
  children
}: React.PropsWithChildren<unknown>) {
  const { data, reshaper } = useReshapeState();

  const actions = useMemo<ContextActions>(
    () => ({
      createDonor: donor =>
        reshaper &&
        reshaper.dispatch &&
        reshaper.dispatch({ id: donorActions.CREATE_DONOR, payload: donor }),
      readDonors: options =>
        reshaper &&
        reshaper.dispatch &&
        reshaper.dispatch({ id: donorActions.READ_DONORS, payload: options }),
      updateDonor: donor =>
        reshaper &&
        reshaper.dispatch &&
        reshaper.dispatch({
          id: donorActions.UPDATE_DONOR,
          payload: donor
        })
    }),
    [reshaper]
  );

  const value: ContextState = {
    ...actions,
    ...data
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
