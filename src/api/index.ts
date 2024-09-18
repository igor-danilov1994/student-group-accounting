import { Student } from '@/src/types';
import axios from 'axios';
import dayjs from 'dayjs';

interface getStudentsRquest {
  page: number;
  rowsPerPage: number;
  searchTerm?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}
interface getStudentsResponse {
  students: Student[];
  totalStudents: number;
}

export const getStudents = async (
  data: getStudentsRquest
): Promise<getStudentsResponse | undefined> => {
  const { page, rowsPerPage, minDate, maxDate, searchTerm } = data;

  try {
    const response = await axios.get<getStudentsResponse>('/api/students', {
      params: {
        page,
        rowsPerPage,
        searchTerm,
        minDate: minDate ? dayjs(minDate).format('YYYY-MM-DD') : '',
        maxDate: maxDate ? dayjs(maxDate).format('YYYY-MM-DD') : '',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error);
  }
};

export const updateStudents = async (
  id: string,
  newStatus: string
): Promise<Student | undefined> => {
  try {
    const response = await axios.put<Student>(`/api/students/${id}`, {
      status: newStatus,
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error);
  }
};
