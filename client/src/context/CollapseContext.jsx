// CollapseContext.js
import React, { createContext, useContext } from 'react';

const CollapseContext = createContext();

export const useCollapseContext = () => {
  return useContext(CollapseContext);
};

export const CollapseProvider = ({ children, collapseAll }) => {
  return (
    <CollapseContext.Provider value={collapseAll}>
      {children}
    </CollapseContext.Provider>
  );
};
