import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";

export const FormContext = createContext(null);

const useStoreData = (initialState) => {
  if (!(initialState instanceof Object))
    throw new Error("initial state must be an object");

  const store = useRef(initialState);

  const get = useCallback(() => store.current, []);

  const set = useCallback((val) => {
    console.log("invoking setter, val: ", val);
    const slice = Object.keys(val)[0];
    // if (store.current[slice] === val[slice])
    store.current = { ...store.current, ...val };
    console.log(store.current);
    broadcast(store.current, Object.keys(val)[0], val);
  }, []);

  const subscriberList = useRef(new Set());

  const subscribe = useCallback((fn, slice) => {
    subscriberList.current.add(fn);
    console.log("ran subscriber, subList: ", subscriberList.current);
    return () => subscriberList.current.delete(fn);
  }, []);

  const broadcast = (store, key, val) => {
    subscriberList.current.forEach((fn) => {
      console.log("invoking subscriber");
      fn(store, key, val);
    });
  };

  return { get, set, subscribe };
};

export const useFormStore = (selector, slice) => {
  const store = useContext(FormContext);
  //    react 18 hook:
  //   const state = useSyncExternalStore(store.subscribe, () =>
  //     selector(store.get())
  //   );
  const [state17, setState17] = useState(selector(store.get()));

  // custom selector if you aren't on React 18
  const stableSelector = useCallback((setter, slice, val, store) => {
    console.log("stable selector");
    return (store, val, slice) => {
        console.log('invoking setter')
        setter(selector(store))
    };
  }, []);

  useEffect(() => {
    return store.subscribe(stableSelector(setState17));
  }, []);

  return [state17, store.set];
};

export default function FormProvider(props) {
  const initialState = { first: "", last: "" };
  return (
    <FormContext.Provider value={useStoreData(initialState)}>
      {props.children}
    </FormContext.Provider>
  );
}
