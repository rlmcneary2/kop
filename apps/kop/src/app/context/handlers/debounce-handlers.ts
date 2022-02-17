import { ActionHandler } from "reshape-state";
import { Action, Dispatcher, InlineHandler } from "reshape-state/types";
import { ContextData, DebounceAction } from "../../type/type";

export function createDebounceHandlers(): ActionHandler<ContextData | null>[] {
  const debounce: ActionHandler<ContextData | null, Action> = (
    state,
    action,
    dispatch
  ) => {
    if (action.id !== debounceActions.DEBOUNCE) {
      return [state];
    }

    if (!isDebounceAction(action)) {
      return [state];
    }

    const { payload } = action;
    if (!payload) {
      return [state];
    }

    const nextState: ContextData = state ?? {};

    // Remove an existing action.
    const nextDebounceRequests = nextState.debounceActions
      ? nextState.debounceActions.filter(
          item => item.debounceId !== action.debounceId
        )
      : [];

    setTimeout(
      () =>
        dispatch(inlineState =>
          handleTimeoutDispatch(action, inlineState, dispatch)
        ),
      action.timeout
    );

    nextDebounceRequests.push(action);

    nextState.debounceActions = nextDebounceRequests;

    return [nextState, true];
  };

  return [debounce];
}

export const debounceActions = Object.freeze({
  DEBOUNCE: "debounce"
});

function handleTimeoutDispatch(
  debounceAction: DebounceAction,
  state: ContextData | null,
  dispatch: Dispatcher<ContextData | null>
): ReturnType<InlineHandler<ContextData | null>> {
  console.log("handleTimeoutDispatch: debounceAction=", debounceAction);

  if (!state?.debounceActions) {
    return [state];
  }

  let found: DebounceAction | null = null;
  let nextDebounceRequests: ContextData["debounceActions"];
  state.debounceActions.forEach(dr => {
    found = dr === debounceAction ? dr : found;
    if (dr !== debounceAction) {
      nextDebounceRequests = nextDebounceRequests ?? [];
      nextDebounceRequests.push(dr);
    }
  });

  if (found) {
    const { payload } = found as DebounceAction;
    payload && dispatch(payload);
  }

  const { debounceActions, ...nextState } = state;
  if (nextDebounceRequests) {
    (nextState as ContextData).debounceActions = nextDebounceRequests;
  }

  return [nextState, true];
}

function isDebounceAction(action: Action): action is DebounceAction {
  return !!(action as DebounceAction).debounceId;
}
