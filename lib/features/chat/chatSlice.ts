import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessagePair {
  user: string;
  bot: string;
}

export interface ChatState {
  chatId: string;
  chatName: string;
  summary?: string;
  messages: MessagePair[];
}

const initialState: ChatState = {
  chatId: "",
  chatName: "",
  summary: "",
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatMetadata: (
      state,
      action: PayloadAction<{
        chatId: string;
        chatName: string;
      }>
    ) => {
      state.chatId = action.payload.chatId;
      state.chatName = action.payload.chatName;
    },
    setChatSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
    setChatMessages: (state, action: PayloadAction<MessagePair[]>) => {
      state.messages = action.payload;
    },
    updateChatMessages: (state, action: PayloadAction<MessagePair>) => {
      state.messages = [...state.messages, action.payload];
    },
    updateStreamingBotSingleMessage: (
      state,
      action: PayloadAction<{
        index: number;
        message: string;
      }>
    ) => {
      const updatedMessages = [...state.messages];
      updatedMessages[action.payload.index] = {
        ...updatedMessages[action.payload.index],
        bot: action.payload.message,
      };
      state.messages = updatedMessages;
    },
  },
});

export const {
  setChatMetadata,
  setChatSummary,
  setChatMessages,
  updateChatMessages,
  updateStreamingBotSingleMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
