'use client';

import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Student } from '@/src/types';
import { getStudents, makeServer, updateStudents } from '@/src/api/server';
import { Loader } from '../components';

makeServer();

interface StudentsContextProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[] | undefined>>;
  updateStudentStatus: (
    id: string,
    status: string
  ) => Promise<Student | undefined>;
}

export const StudentsContext = createContext<StudentsContextProps | undefined>(
  undefined
);

interface StudentsProviderProps {
  children: ReactNode;
}

export const StudentsProvider: FC<StudentsProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[] | undefined>(undefined);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      if (response) {
        setStudents(response);
      }
    } catch (error) {
      console.error('Ошибка при загрузке студентов:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
        setStudents,
        updateStudentStatus,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};
