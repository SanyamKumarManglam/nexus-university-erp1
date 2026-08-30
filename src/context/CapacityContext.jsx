import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const CapacityContext = createContext();

export function CapacityProvider({ children }) {
  const [capacityCap, setCapacityCapState] = useState(() => {
    return storageService.getCapacityCap();
  });

  const isCustom = capacityCap !== null && capacityCap !== undefined;

  const validateCapInput = (val) => {
    if (val === '' || val === null || val === undefined) {
      return { isValid: false, message: 'Please enter a capacity limit number.', parsedValue: null };
    }
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { isValid: false, message: 'Capacity cap must be a whole integer.', parsedValue: null };
    }
    if (num < 10) {
      return { isValid: false, message: 'Capacity cap must be at least 10 advisees.', parsedValue: null };
    }
    if (num > 500) {
      return { isValid: false, message: 'Capacity cap cannot exceed 500 advisees for accreditation safety.', parsedValue: null };
    }
    return { isValid: true, message: '', parsedValue: num };
  };

  const setCapacityCap = (val) => {
    const check = validateCapInput(val);
    if (!check.isValid) {
      return { success: false, error: check.message };
    }
    storageService.saveCapacityCap(check.parsedValue);
    setCapacityCapState(check.parsedValue);
    return { success: true, value: check.parsedValue };
  };

  const resetCapacityCap = () => {
    storageService.clearCapacityCap();
    setCapacityCapState(null);
  };

  const getEffectiveCap = (defaultCap = 120) => {
    return isCustom ? capacityCap : (defaultCap || 120);
  };

  return (
    <CapacityContext.Provider
      value={{
        capacityCap,
        isCustom,
        setCapacityCap,
        resetCapacityCap,
        getEffectiveCap,
        validateCapInput
      }}
    >
      {children}
    </CapacityContext.Provider>
  );
}

export function useCapacity() {
  const context = useContext(CapacityContext);
  if (!context) {
    throw new Error('useCapacity must be used within a CapacityProvider');
  }
  return context;
}
