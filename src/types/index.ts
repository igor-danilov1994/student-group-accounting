import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  status: 'учится' | 'исключен';
  idnp: string;
}

export const StudentModel: ModelDefinition<Student> = Model.extend({});
