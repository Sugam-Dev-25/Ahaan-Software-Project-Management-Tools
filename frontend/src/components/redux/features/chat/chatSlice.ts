import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Conversation, User } from "./chatType";

interface ChatState {
  isOpen: boolean;
  conversationId: string | null;
  selectedUser: User | null;

  /* 🔥 Teams-style */
  activeChat: Conversation | null;
}

const initialState: ChatState = {
  isOpen: false,
  conversationId: null,
  selectedUser: null,
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /* EXISTING */

    openChat(state, action: PayloadAction<User>) {
      state.isOpen = true;
      state.selectedUser = action.payload;
    },

    setConversation(
      state,
      action: PayloadAction<string | null>
    ) {
      state.conversationId = action.payload;
    },

    closeChat(state) {
      state.isOpen = false;
      state.conversationId = null;
      state.selectedUser = null;
      state.activeChat = null;
    },

    /* 🔥 Teams Sidebar → select chat */

    setActiveChat(
      state,
      action: PayloadAction<Conversation>
    ) {
      state.activeChat = action.payload;
      state.conversationId = action.payload._id;
      state.isOpen = true;
    },
  },
});

export const {
  openChat,
  closeChat,
  setConversation,
  setActiveChat,
} = chatSlice.actions;

export default chatSlice.reducer;
