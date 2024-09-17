import { FC, memo } from 'react';
import { Student } from '@/src/types';
import { TableBody } from '@mui/material';
import { StudentsTableRow } from '../StudentsTableRow/StudentsTableRow';
import styles from './style.module.scss';

interface StudentsTableBodyProps {
  students: Student[];
  rowsPerPage: number;
  page: number;
}

export const StudentsTableBody: FC<StudentsTableBodyProps> = memo(props => {
  const { students, rowsPerPage, page } = props;

  return (
    <TableBody className={styles.tableBody}>
      {students
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(student => (
          <StudentsTableRow key={student.id} student={student} />
        ))}
    </TableBody>
  );
});

StudentsTableBody.displayName = 'StudentsTableBody';
