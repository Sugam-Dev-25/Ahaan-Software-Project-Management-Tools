import {
  PopcornIcon,
  FirstAid,
  BellSlash,
  CarProfileIcon,
  PhoneCall,
  PersonSimpleBikeIcon,
} from "@phosphor-icons/react";


export type UserStatus =
  | "lunch"
  | "sick"
  | "dnd"
  | "meeting"
  | "travelling"
  | "short-break"
  | null;

export const STATUS_META = {
  lunch: {
    label: "Lunch Break",
    icon: PopcornIcon,
  },

  sick: {
    label: "Sick",
    icon: FirstAid,
  },

  dnd: {
    label: "Do Not Disturb",
    icon: BellSlash,
  },

  travelling: {
    label: "Travelling",
    icon: CarProfileIcon,
  },

  meeting: {
    label: "In a Meeting",
    icon: PhoneCall,
  },

  "short-break": {
    label: "Short Break",
    icon: PersonSimpleBikeIcon,
  },
};