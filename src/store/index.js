import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import mainReducer from "@/store/main/mainSlice";

const store = configureStore({
  reducer: {
    main: mainReducer,
  },
});

setupListeners(store.dispatch);

export default store;