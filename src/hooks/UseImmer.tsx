import { useState ,useCallback} from 'react';
import { freeze , produce , Draft} from "immer";

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];
export function useImmer<S = unknown>(initialValue: S | (() => S)): ImmerHook<S>;
export function useImmer<T>(initialValue:T) { 
    const [value, setValue] = useState(freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true));
    return [value, useCallback((updater: (T | DraftFunction<T>)) => {
        if (typeof updater === 'function') {
            setValue(produce(updater as DraftFunction<T>));
        } else {
            setValue(freeze(updater));
        }
    },[])]
}