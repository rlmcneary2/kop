import { isEqual } from "lodash";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../type/type";
import { Context } from "./context";

export function useContextData<T extends Partial<ContextData>>(
  selector: Selector<T> = ctx => ctx as T
): T {
  const ctx = useContext(Context);
  const [data, setData] = useState<Partial<ContextData>>({});

  useEffect(() => {
    setData(current => {
      let next = {};
      if (ctx) {
        next = selector(ctx);
      }

      if (isEqual(current, next)) {
        console.log(
          "%cuseContextData: selector returned the same results.",
          "color: red"
        );
        return current;
      } else {
        console.log(
          "%cuseContextData: selector returned DIFFERENT results.",
          "color: red"
        );
      }

      return next;
    });
  }, [ctx, selector]);

  console.log("useContextData: exit; data=", data);
  return data as T;
}

interface Selector<T extends Partial<ContextData>> {
  (ctx: ContextData): T;
}
