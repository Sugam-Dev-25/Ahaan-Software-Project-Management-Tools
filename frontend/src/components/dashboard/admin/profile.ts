export interface User {
  name: string;
  email: string;
}

export interface Profile {
  _id: string;
  user: User;
  type?: string; // optional to match both cases
  contactInfo?: { phone: string; email: string };
  description?: string;
  status: string;
}
