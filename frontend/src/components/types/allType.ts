export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
};

export type Column = {
    _id: string;
    name: string;
    board: string;
};

export type Board = {
    _id: string;
    name: string;
    members: User[];
    columns: Column[];
};

// --- New Time Tracking Types ---
export type DailyLog = {
    date: string;    // "YYYY-MM-DD"
    duration: number; // in milliseconds
};

export type TimeManagement = {
    estimatedTime: number;    // Total hours required (e.g., 20)
    totalLoggedTime: number;  // Sum of all durations in milliseconds
    dailyLogs: DailyLog[];    // Array for the 4h, 8h, 8h breakdown
    activeStartTime: string | null; // ISO Date string when "Start" clicked
    isRunning: boolean;       // Status of the timer
};

// --- Updated Sub-types ---
export type Comment = {
    _id: string;
    user: User; // Changed from User[] as a comment usually belongs to one person
    text: string;
    createdAt: string;
};

export type Activity = {
    _id: string;
    user: User; // Changed from User[]
    action: string;
    createdAt: string;
    details?: {
        field: string;
        oldValue: any;
        newValue: any;
    };
};

export type Label = {
    name: string;
    color: string;
};

export type Attachment = {
    _id: string;
    fileName: string;
    fileUrl: string;
    uploadedBy: User;
};

export type Subtask = { 
    _id?: string;
    title: string; 
    isCompleted: boolean;
};

// --- Final Updated Task Type ---
export type Task = {
    _id: string;
    title: string;
    progress: number;
    description: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    dueDate: string | Date; // Date usually comes as a string from JSON
    startDate: string | Date;
    assignedTo: User[];
    column: any; // Can be string ID or populated Column object
    board: any;  // Can be string ID or populated Board object
    subtasks: Subtask[];
    attachments: Attachment[]; // Fixed naming from "attachment"
    comments: Comment[];
    activityLog: Activity[];
    labels: Label[];
    position: number;
    timeManagement?: TimeManagement; // Added time tracking object
    createdAt: string;
    updatedAt: string;
};