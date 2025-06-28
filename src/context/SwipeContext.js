import React, { createContext, useContext } from 'react';

const SwipeContext = createContext({ setSwipeEnabled: () => {} });

export const useSwipe = () => useContext(SwipeContext);
export const SwipeProvider = SwipeContext.Provider;

export default SwipeContext;
