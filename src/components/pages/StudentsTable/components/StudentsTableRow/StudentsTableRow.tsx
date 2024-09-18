import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Student } from '@/src/types';
import style from './style.module.scss';
import { useStudents } from '@/src/hooks';
import { Button } from '@/src/components';
import { CustomSnackbar } from '@/src/components/ui/snackbar/Snackbar'; // Импортируем Alert из Material-UI

interface StudentsTableRowProps {
  student: Student;
  index: number;
}

const renderTableCell = (content: string) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '8px',
      }}
    >
      {content}
    </div>
  );
};

export const StudentsTableRow: FC<StudentsTableRowProps> = memo(
  ({ student: propStudent, index }) => {
    const [student, setStudent] = useState<Student>(propStudent);
    const { updateStudentStatus } = useStudents();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
      'success' | 'error'
    >('success');

    useEffect(() => {
      setStudent(propStudent);
    }, [propStudent]);

    const updateStudentStatusHandler = useCallback(async () => {
      try {
        const newStatus = student.status === 'учится' ? 'исключен' : 'учится';
        const response = await updateStudentStatus(student.id, newStatus);

        if (response) {
          setStudent(response);
          setSnackbarMessage(`Статус успешно обновлен на ${newStatus}`);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage(
          'Ошибка обновления статуса студента. Неправильный формат IDNP.'
        );
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }, [student, updateStudentStatus]);

    const handleCloseSnackbar = (
      event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };

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
        {renderTableCell(`${index + 1}`)}
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
        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          message={snackbarMessage}
        />
      </div>
    );
  }
);

StudentsTableRow.displayName = 'StudentsTableRow';
