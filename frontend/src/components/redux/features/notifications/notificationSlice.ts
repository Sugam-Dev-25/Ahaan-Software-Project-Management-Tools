import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

interface Notification {
    _id: string;
    recipient: string;
    sender: { _id: string; name: string; email: string };
    task: { _id: string; title: string };
    action: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: "idle" | "pending" | "fulfilled" | "failed";
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: "idle",
    error: null,
};

// 1. Fetch all notifications
export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
    "notifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get("/api/notifications", { withCredentials: true });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// 2. Mark a single notification as read
export const markAsRead = createAsyncThunk<string, string, { rejectValue: string }>(
    "notifications/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await axiosClient.put(`/api/notifications/${id}/read`, {}, { withCredentials: true });
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
export const markAllNotificationsAsRead = createAsyncThunk<void, void, { rejectValue: string }>(
    "notifications/markAllAsRead",
    async (_, { rejectWithValue }) => {
        try {
            // MATCH THIS URL TO YOUR BACKEND ROUTE EXACTLY
            await axiosClient.put("/api/notifications/read-all", {}, { withCredentials: true });
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // Use this to add a notification in real-time if using Socket.io
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = "fulfilled";
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            })
            // Optimistic update for marking as read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex((n) => n._id === action.payload);
                if (index !== -1 && !state.notifications[index].isRead) {
                    state.notifications[index].isRead = true;
                    state.unreadCount -= 1;
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;