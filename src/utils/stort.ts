import { Order, Student } from '@/src/types';

export const sortStudents = (
  students: Student[],
  orderBy: keyof Student,
  order: Order
): Student[] => {
  return students.sort((a, b) => {
    let comparison = 0;

    if (a[orderBy] < b[orderBy]) {
      comparison = -1;
    }

    if (a[orderBy] > b[orderBy]) {
      comparison = 1;
    }

    return order === 'asc' ? comparison : -comparison;
  });
};
