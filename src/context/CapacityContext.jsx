import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const CapacityContext = createContext();

export function CapacityProvider({ children }) {
  const [globalCapacityCap, setGlobalCapacityCapState] = useState(() => {
    return storageService.getCapacityCap();
  });

  const [facultyCaps, setFacultyCapsState] = useState(() => {
    return storageService.getFacultyCaps();
  });

  const isCustom = globalCapacityCap !== null && globalCapacityCap !== undefined;

  const validateCapInput = (val) => {
    if (val === '' || val === null || val === undefined) {
      return { isValid: false, message: 'Please enter a capacity limit number.', parsedValue: null };
    }
    const trimmed = String(val).trim();
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return { isValid: false, message: 'Capacity cap cannot contain letters or invalid characters. Enter a positive number.', parsedValue: null };
    }
    const num = Number(trimmed);
    if (isNaN(num) || !isFinite(num)) {
      return { isValid: false, message: 'Please enter a valid numeric capacity cap.', parsedValue: null };
    }
    if (num <= 0) {
      return { isValid: false, message: 'Capacity cap cannot be zero or negative. Must be a positive number.', parsedValue: null };
    }
    if (!Number.isInteger(num)) {
      return { isValid: false, message: 'Capacity cap must be a whole positive integer without decimals.', parsedValue: null };
    }
    if (num > 500) {
      return { isValid: false, message: 'Capacity cap cannot exceed 500 advisees for institutional safety.', parsedValue: null };
    }
    return { isValid: true, message: '', parsedValue: num };
  };

  // Global cap methods (for backward compatibility and global presets)
  const setCapacityCap = (val) => {
    const check = validateCapInput(val);
    if (!check.isValid) {
      return { success: false, error: check.message };
    }
    storageService.saveCapacityCap(check.parsedValue);
    setGlobalCapacityCapState(check.parsedValue);
    return { success: true, value: check.parsedValue };
  };

  const resetCapacityCap = () => {
    storageService.clearCapacityCap();
    setGlobalCapacityCapState(null);
  };

  // Per-faculty specific cap methods
  const getFacultyCap = (facultyId, defaultCap = 120) => {
    if (facultyId && facultyCaps[facultyId] !== undefined && facultyCaps[facultyId] !== null) {
      return facultyCaps[facultyId];
    }
    if (globalCapacityCap !== null && globalCapacityCap !== undefined) {
      return globalCapacityCap;
    }
    return defaultCap || 120;
  };

  const isFacultyCustom = (facultyId) => {
    return Boolean(facultyId && facultyCaps[facultyId] !== undefined && facultyCaps[facultyId] !== null);
  };

  const setFacultyCap = (facultyId, val) => {
    if (!facultyId) return { success: false, error: 'Invalid faculty ID' };
    const check = validateCapInput(val);
    if (!check.isValid) {
      return { success: false, error: check.message };
    }
    const updated = storageService.saveFacultyCap(facultyId, check.parsedValue);
    setFacultyCapsState({ ...updated });
    return { success: true, value: check.parsedValue, facultyId };
  };

  const resetFacultyCap = (facultyId) => {
    if (!facultyId) return;
    const updated = storageService.removeFacultyCap(facultyId);
    setFacultyCapsState({ ...updated });
  };

  const resetAllFacultyCaps = () => {
    storageService.clearAllFacultyCaps();
    setFacultyCapsState({});
  };

  const getEffectiveCap = (defaultCap = 120) => {
    return isCustom ? globalCapacityCap : (defaultCap || 120);
  };

  return (
    <CapacityContext.Provider
      value={{
        capacityCap: globalCapacityCap,
        globalCapacityCap,
        isCustom,
        facultyCaps,
        getFacultyCap,
        isFacultyCustom,
        setFacultyCap,
        resetFacultyCap,
        resetAllFacultyCaps,
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
