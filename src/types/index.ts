export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  status: Status;
  idnp: string;
}

type Status = 'учится' | 'исключен';

export type Order = 'asc' | 'desc';
