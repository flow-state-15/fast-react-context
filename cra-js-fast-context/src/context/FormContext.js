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

const useCreateStore = (initialState) => {
	if (!(initialState instanceof Object))
		throw new Error("initial state must be an object");

	const store = useRef(initialState);
	const subscriberList = useRef(new Set());

	const getState = useCallback(() => store.current, []);

	const dispatch = useCallback((val) => {
		store.current = { ...store.current, ...val };
		broadcast(store.current);
	}, []);

	const broadcast = (store) => {
		subscriberList.current.forEach((fn) => fn(store));
	};

	const subscribe = useCallback((fn) => {
		subscriberList.current.add(fn);
		return () => subscriberList.current.delete(fn);
	}, []);

	return { getState, dispatch, subscribe };
};

export const useStore = (selector) => {
	const store = useContext(FormContext);
	const [, setState] = useState(selector(store.getState()));

	//   react 18 hook to replace stableSelector:
	//   const state = useSyncExternalStore(store.subscribe, () =>
	//     selector(store.get())
	//   );

	const stableSelector = useCallback(
		(setter) => (store) => setter(selector(store)),
		[]
	);

	useEffect(() => {
		return store.subscribe(stableSelector(setState));
	}, []);

	return [selector(store.getState()), store.dispatch];
};

//  generic context provider
export default function Provider(props) {
	const initialState = { first: "", last: "" };
	const store = useCreateStore(initialState);
	return (
		<FormContext.Provider value={store}>
			{props.children}
		</FormContext.Provider>
	);
}
