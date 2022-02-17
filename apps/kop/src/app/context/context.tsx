import { createContext } from "react";
import { ContextState } from "../type/type";

export const Context = createContext<ContextState | null>(null);
