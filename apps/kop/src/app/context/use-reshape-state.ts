import { useEffect, useState } from "react";
import { create, Reshaper } from "reshape-state";
import { environment as env } from "../../environments/environment";
import { ContextData } from "../type/type";
import { createDebounceHandlers, createDonorHandlers } from "./handlers";

export function useReshapeState() {
  const [reshaper, setReshaper] = useState<Reshaper<ContextData | null> | null>(
    null
  );
  const [data, setData] = useState<ContextData | null>(null);

  useEffect(() => {
    if (reshaper) {
      return;
    }

    function handleOnChange(state: ContextData | null) {
      console.log(
        "%cuseReshapeState: state=%o",
        "color: darkblue; font-weight: bold",
        state
      );
      setData({ ...state });
    }

    const nextReshaper = create<ContextData | null>({ loopUntilSettled: true })
      .addOnChange(handleOnChange)
      .addHandlers([
        ...createDonorHandlers({
          apiKey: env.firebaseApiKey,
          authDomain: env.firebaseAuthDomain,
          storageBucket: env.firebaseStorageBucket
        }),
        ...createDebounceHandlers()
      ]);

    setReshaper(nextReshaper);
  }, [reshaper]);

  useEffect(() => {
    reshaper && reshaper.setGetState(() => data);
  }, [data, reshaper]);

  return { data, reshaper };
}
