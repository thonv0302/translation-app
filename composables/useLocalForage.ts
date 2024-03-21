import type { Ref, ShallowRef } from 'vue';

import { ref, shallowRef, watchEffect } from 'vue';
import localforage from 'localforage';

localforage.config({
  driver: localforage.INDEXEDDB,
});

type UseLocalStorageReturnedValue<StoredValueType> = {
  storedValue: ShallowRef<StoredValueType>;
  setValue: (value: StoredValueType | ((val: StoredValueType) => StoredValueType)) => Promise<void>;
  removeValue: () => Promise<void>;
  error: Ref<Error | undefined>;
  getValue: () => Promise<StoredValueType | null>;
};

/**
 * Custom hook for managing data storage using localForage.
 *
 * @template StoredValueType - The type of the stored value.
 * @param {string} key - The key used to identify the stored value.
 * @param {StoredValueType} initialValue - The initial value of the stored value.
 * @returns {UseLocalStorageReturnedValue<StoredValueType>} - An object containing the stored value, a function to set the stored value, and a function to remove the stored value.
 *
 * @example
 * const {
 *  storedValue: localDraftEntries,
 *  setValue: setLocalDraftEntries,
 *  getValue: getDraftEntries,
 * } = useLocalForage<LocalDraftEntries>(DRAFT_ENTRY_STORAGE_KEY, {});
 *
 */
export const useLocalForage = <StoredValueType>(
  key: string,
  initialValue: StoredValueType,
): UseLocalStorageReturnedValue<StoredValueType> => {
  const storedValue = shallowRef<StoredValueType>(initialValue);
  const error = ref<Error>();

  watchEffect(() => {
    (async () => {
      try {
        const savedValue = (await localforage.getItem(key)) as StoredValueType;
        storedValue.value = savedValue ?? initialValue;
      } catch (err) {
        if (err instanceof Error) {
          error.value = err;
        }
      }
    })();
  });

  async function setValue(value: StoredValueType | ((val: StoredValueType) => StoredValueType)) {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue.value as StoredValueType) : value;
      // Save state
      storedValue.value = valueToStore;
      // Save to local storage
      await localforage.setItem(key, valueToStore);
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    }
  }

  async function removeValue() {
    try {
      // update state
      storedValue.value = initialValue;
      // update local storage
      await localforage.removeItem(key);
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    }
  }

  async function getValue(): Promise<StoredValueType | null> {
    return localforage.getItem(key);
  }

  return {
    storedValue,
    setValue,
    removeValue,
    error,
    getValue,
  };
};
