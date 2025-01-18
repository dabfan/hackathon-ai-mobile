import { createSlice } from '@reduxjs/toolkit';

export type InitialState = {
  selectedImage: string,
  imageMetaData: any
};

export const initialState: InitialState = { 
  selectedImage: null,
  imageMetaData: {},
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    saveSelectedImage: (state, data) => {
      state.selectedImage = data.payload;
    },
    saveImageMetaData: (state, data) => {
      state.imageMetaData = data.payload;
    },
  },
});

export const { saveSelectedImage, saveImageMetaData } = appSlice.actions;
export default appSlice.reducer;