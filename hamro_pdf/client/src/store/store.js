// store/store.js (or store/index.js)
import { configureStore } from "@reduxjs/toolkit";

// Existing slices

import userReducer from "./slices/userSlice";
import splashReducer from "./slices/splashSlice";
import adReducer from "./slices/adSlice";
import pdfReducer from "./slices/pdfSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    splash: splashReducer,
    ads: adReducer,
    pdf: pdfReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Export for use in useSelector hooks
export default store;
