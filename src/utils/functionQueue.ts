/**
 * A tiny ordered function queue utility.
 *
 * Requirements covered:
 * 1) Functions (mostly arrow) can be added to the object via add(fn)
 * 2) Functions are kept in insertion order
 * 3) next() executes the next function each time it is called
 * 4) addResetFunction(fn) registers a function that will be called whenever reset() is invoked
 *
 * Note: If GSAP's timeline already fits your use case (e.g., tl.add(() => {...}); tl.play()),
 * you can use that instead. This utility is framework-agnostic and has no deps.
 */

export type Thunk = () => unknown;

export type FunctionQueue = {
  add: (fn: Thunk) => void;
  addResetFunction: (fn: Thunk) => void;
  next: () => unknown | undefined;
  hasNext: () => boolean;
  reset: () => void;
  size: () => number;
  index: () => number;
  peek: () => Thunk | undefined;
};

export function createFunctionQueue(initial?: Thunk[]): FunctionQueue {
  const fns: Thunk[] = Array.isArray(initial) ? [...initial] : [];
  let cursor = 0; // index of next function to execute
  let resetFn: Thunk | undefined;

  const api: FunctionQueue = {
    add(fn: Thunk) {
      if (typeof fn !== 'function') return;
      fns.push(fn);
    },
    addResetFunction(fn: Thunk) {
      if (typeof fn !== 'function') return;
      resetFn = fn;
    },
    next() {
      if (cursor >= fns.length) return undefined;
      const fn = fns[cursor++];
      try {
        return fn();
      } catch (e) {
        // Keep advancing even if a function throws to avoid getting stuck
        // Consumers can handle undefined return or thrown errors externally if needed
        throw e;
      }
    },
    hasNext() {
      return cursor < fns.length;
    },
    reset() {
      // Call the optional reset function if set
      try {
        if (resetFn) resetFn();
      } finally {
        // Always reset the cursor even if resetFn throws
        cursor = 0;
      }
    },
    size() {
      return fns.length;
    },
    index() {
      return cursor;
    },
    peek() {
      return cursor < fns.length ? fns[cursor] : undefined;
    }
  };

  return api;
}

/**
 * Singleton-style queue if you prefer a shared instance across the app.
 * Import as: import { functionQueue } from '@/utils/functionQueue';
 */
export const functionQueue: FunctionQueue = createFunctionQueue();

// Example usage:
// const q = createFunctionQueue();
// q.add(() => console.log('First'));
// q.add(() => console.log('Second'));
// q.addResetFunction(() => console.log('Reset called'));
// q.next(); // logs 'First'
// q.reset(); // logs 'Reset called' and resets cursor to 0
// q.next(); // logs 'First' again
// q.next(); // logs 'Second'
