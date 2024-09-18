import React, { ChangeEvent, FC } from 'react';
import { TablePagination } from '@mui/material';

interface StudentsTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const StudentsTablePagination: FC<StudentsTablePaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(e, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
