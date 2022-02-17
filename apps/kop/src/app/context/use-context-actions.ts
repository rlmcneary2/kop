import { useContext, useMemo } from "react";
import { ContextActions } from "../type/type";
import { Context } from "./context";

export function useContextActions(): Result {
  const ctx = useContext(Context);

  return useMemo<Result>(
    () => ({
      /* eslint-disable @typescript-eslint/no-empty-function */
      createDonor: ctx ? ctx.createDonor : () => {},
      readDonors: ctx ? ctx.readDonors : () => {},
      updateDonor: ctx ? ctx.updateDonor : () => {}
      /* eslint-enable @typescript-eslint/no-empty-function */
    }),
    [ctx]
  );
}

type Result = ContextActions;
