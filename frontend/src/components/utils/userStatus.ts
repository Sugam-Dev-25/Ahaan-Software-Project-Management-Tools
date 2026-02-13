export type UserStatus =
  | "lunch"
  | "sick"
  | "dnd"
  | "meeting"
  | "travelling"
  | "short-break"
  | null;

export const STATUS_META: Record<
  Exclude<UserStatus, null>,
  {
    label: string;
    emoji: string;
  }
> = {
  lunch: {
    label: "Lunch Break",
    emoji: "🍜",
  },
  sick: {
    label: "Sick",
    emoji: "🤒",
  },
  dnd: {
    label: "Do Not Disturb",
    emoji: "🔕",
  },
  travelling: {
    label: "Travelling",
    emoji: "🏖️",
  },
    meeting: {
    label: "In a Meeting",
    emoji: "📞",
  },
    "short-break": {
    label: "Short Break",
    emoji: "🚶‍♂️",
  },

};
