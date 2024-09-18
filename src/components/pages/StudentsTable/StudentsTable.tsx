'use client';

import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import dayjs from 'dayjs';
import { Paper } from '@mui/material';
import { Order, Student } from '@/src/types';
import { useStudents, useUrlState } from '@/src/hooks';
import {
  Filters,
  StudentsTablePagination,
  StudentsVirtualizedTable,
} from './components';
import { getStudents } from '@/src/api';
import { sortStudents } from '@/src/utils';

export const StudentsTable: FC = () => {
  const {
    students,
    totalStudentsCount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  } = useStudents();
  const { urlState, updateUrlState } = useUrlState();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const handleFilterChange = useCallback(
    async (searchTerm: string, minDate: Date | null, maxDate: Date | null) => {
      try {
        const data = await getStudents({
          page: 1,
          rowsPerPage: 10,
          searchTerm,
          minDate,
          maxDate,
        });

        if (data) {
          setFilteredStudents(data.students);

          updateUrlState({
            searchTerm,
            minDate: minDate ? dayjs(minDate).format('YYYY-MM-DD') : '',
            maxDate: maxDate ? dayjs(maxDate).format('YYYY-MM-DD') : '',
          });
        }
      } catch (error) {
        console.error('Ошибка при фильтрации студентов:', error);
      }
    },
    [updateUrlState]
  );

  const handleRequestSort = useCallback(
    (property: keyof Student) => {
      const isAsc = urlState?.orderBy === property && urlState?.order === 'asc';
      const newOrder: Order = isAsc ? 'desc' : 'asc';

      updateUrlState({ orderBy: property, order: newOrder });
    },
    [urlState, updateUrlState]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateUrlState({ page: newPage });
    },
    [setPage, updateUrlState]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(1);
      updateUrlState({ rowsPerPage: newRowsPerPage, page: 1 });
    },
    [setRowsPerPage, setPage, updateUrlState]
  );

  const sortedStudents = useMemo(() => {
    return sortStudents(
      filteredStudents,
      urlState?.orderBy as keyof Student,
      urlState?.order as Order
    );
  }, [filteredStudents, urlState]);

  if (!urlState) {
    return null;
  }

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: '1200px',
      }}
    >
      <Filters
        onFilterChange={handleFilterChange}
        initialSearchTerm={urlState.searchTerm || ''}
        initialMinDate={urlState.minDate ? new Date(urlState.minDate) : null}
        initialMaxDate={urlState.maxDate ? new Date(urlState.maxDate) : null}
      />
      <StudentsVirtualizedTable
        students={sortedStudents}
        orderBy={urlState.orderBy as keyof Student}
        order={urlState.order as 'asc' | 'desc'}
        onRequestSort={handleRequestSort}
      />
      <StudentsTablePagination
        count={totalStudentsCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
