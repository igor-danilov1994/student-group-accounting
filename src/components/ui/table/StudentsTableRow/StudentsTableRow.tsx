import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Student } from '@/src/types';
import style from './style.module.scss';
import { useStudents } from '@/src/hooks';
import { Button } from '@/src/components';

interface StudentsTableRowProps {
  student: Student;
}

const renderTableCell = (content: string) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
};

export const StudentsTableRow: FC<StudentsTableRowProps> = memo(
  ({ student: propStudent }) => {
    const [student, setStudent] = useState<Student>(propStudent);
    const { updateStudentStatus } = useStudents();

    useEffect(() => {
      setStudent(propStudent);
    }, [propStudent]);

    const updateStudentStatusHandler = useCallback(async () => {
      const newStatus = student.status === 'учится' ? 'исключен' : 'учится';
      const response = await updateStudentStatus(student.id, newStatus);

      if (response) {
        setStudent(response);
      }
    }, [student, updateStudentStatus]);

    const isActive = student.status !== 'исключен';

    return (
      <div
        className={isActive ? style.active : style.disabled}
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          height: '100%',
        }}
      >
        {renderTableCell(student.firstName)}
        {renderTableCell(student.lastName)}
        {renderTableCell(`${student.birthYear}`)}
        {renderTableCell(student.status)}
        {renderTableCell(student.idnp)}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            color={!isActive ? 'secondary' : 'primary'}
            onClick={updateStudentStatusHandler}
          >
            {isActive ? 'Исключить' : 'Включить'}
          </Button>
        </div>
      </div>
    );
  }
);

StudentsTableRow.displayName = 'StudentsTableRow';
