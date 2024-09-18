'use client';

import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Student } from '@/src/types';
import { makeServer } from '@/src/api/server';
import { getStudents, updateStudents } from '@/src/api';
import { Loader } from '../components';

makeServer();

interface StudentsContextProps {
  students: Student[];
  totalStudentsCount: number;
  setStudents: React.Dispatch<React.SetStateAction<Student[] | undefined>>;
  updateStudentStatus: (
    id: string,
    status: string
  ) => Promise<Student | undefined>;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
}

export const StudentsContext = createContext<StudentsContextProps | undefined>(
  undefined
);

interface StudentsProviderProps {
  children: ReactNode;
}

export const StudentsProvider: FC<StudentsProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[] | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);

  const fetchStudents = async () => {
    try {
      const response = await getStudents({ page: page + 1, rowsPerPage });
      if (response) {
        setStudents(response.students);
        setTotalStudentsCount(response.totalStudents);
      }
    } catch (error) {
      console.error('Ошибка при загрузке студентов:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage]);

  const updateStudentStatus = async (
    id: string,
    status: string
  ): Promise<Student | undefined> => {
    try {
      return updateStudents(id, status);
    } catch (error) {
      console.error('Ошибка при обновлении статуса студента:', error);
    }
    return undefined;
  };

  if (!students) {
    return <Loader />;
  }

  return (
    <StudentsContext.Provider
      value={{
        students,
        totalStudentsCount,
        setStudents,
        updateStudentStatus,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};
