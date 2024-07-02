import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from '../features/contactsSlice';

export default configureStore({
  reducer: {
    contacts: contactsReducer,
  },
});