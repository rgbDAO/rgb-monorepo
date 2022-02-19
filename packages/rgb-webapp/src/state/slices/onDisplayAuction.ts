import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionRgbId: number | undefined;
  onDisplayAuctionRgbId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionRgbId: undefined,
  onDisplayAuctionRgbId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionRgbId: (state, action: PayloadAction<number>) => {
      state.lastAuctionRgbId = action.payload;
    },
    setOnDisplayAuctionRgbId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionRgbId = action.payload;
    },
    setPrevOnDisplayAuctionRgbId: state => {
      if (!state.onDisplayAuctionRgbId) return;
      if (state.onDisplayAuctionRgbId === 0) return;
      state.onDisplayAuctionRgbId = state.onDisplayAuctionRgbId - 1;
    },
    setNextOnDisplayAuctionRgbId: state => {
      if (state.onDisplayAuctionRgbId === undefined) return;
      if (state.lastAuctionRgbId === state.onDisplayAuctionRgbId) return;
      state.onDisplayAuctionRgbId = state.onDisplayAuctionRgbId + 1;
    },
  },
});

export const {
  setLastAuctionRgbId,
  setOnDisplayAuctionRgbId,
  setPrevOnDisplayAuctionRgbId,
  setNextOnDisplayAuctionRgbId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
