export interface RSVPData {
  id?: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  dietary?: string;
  wishes?: string;
  created_at?: string;
}
