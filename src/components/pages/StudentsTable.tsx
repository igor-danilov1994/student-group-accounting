'use client';

import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { Paper } from '@mui/material';
import { Student } from '@/src/types';
import { useStudents } from '@/src/hooks';
import { Filters } from './Filters/Filters';
import { StudentsVirtualizedTable } from './StudentsVirtualizedTable';
import { StudentsTablePagination } from './StudentsTablePagination';
import dayjs from 'dayjs';

export const StudentsTable: FC = () => {
  const { students } = useStudents();
  const [orderBy, setOrderBy] = useState<keyof Student>('firstName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  // Обработчик изменений фильтров
  const handleFilterChange = useCallback(
    (searchTerm: string, minDate: Date | null, maxDate: Date | null) => {
      const filtered = students.filter(student => {
        const matchesName = `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesIDNP = student.idnp.includes(searchTerm);
        const studentDate = dayjs(`${student.birthYear}-01-01`);
        const isAfterMin = minDate
          ? studentDate.isAfter(minDate) || studentDate.isSame(minDate, 'day')
          : true;
        const isBeforeMax = maxDate
          ? studentDate.isBefore(maxDate) || studentDate.isSame(maxDate, 'day')
          : true;

        return (matchesName || matchesIDNP) && isAfterMin && isBeforeMax;
      });
      setFilteredStudents(filtered);
    },
    [students]
  );

  const handleRequestSort = useCallback(
    (property: keyof Student) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [orderBy]
  );

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      if (a[orderBy] < b[orderBy]) comparison = -1;
      if (a[orderBy] > b[orderBy]) comparison = 1;
      return order === 'asc' ? comparison : -comparison;
    });
  }, [filteredStudents, order, orderBy]);

  return (
    <Paper
      sx={{
        width: '100%',
      }}
    >
      <Filters onFilterChange={handleFilterChange} />
      <StudentsVirtualizedTable
        students={sortedStudents}
        orderBy={orderBy}
        order={order}
        onRequestSort={handleRequestSort}
      />
      <StudentsTablePagination
        count={sortedStudents.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
