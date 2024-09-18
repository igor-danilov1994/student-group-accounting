import { ChangeEvent, FC, memo } from 'react';
import { TablePagination } from '@mui/material';
import style from './style.module.scss';

interface StudentsTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const StudentsTablePagination: FC<StudentsTablePaginationProps> = memo(
  props => {
    const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } =
      props;
    return (
      <TablePagination
        className={style.pagination}
        component="div"
        count={count}
        page={page}
        onPageChange={(e, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    );
  }
);

StudentsTablePagination.displayName = 'StudentsTablePagination';
