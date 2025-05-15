import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TStateIngredients = {
  ingredients: Array<TIngredient>;
  error: null | string;
  loading: boolean;
};

const initialState: TStateIngredients = {
  ingredients: [],
  error: null,
  loading: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const respons = await getIngredientsApi();
    return respons;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'ошибка';
      });
  },
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    getLoadingStatus: (state) => state.loading
  }
});

export default ingredientsSlice;
export const { getIngredientsSelector, getLoadingStatus } =
  ingredientsSlice.selectors;
