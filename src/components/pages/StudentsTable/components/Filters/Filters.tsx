import React, { FC, useEffect, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDebounce } from '@/src/hooks/useDebounce';
import { CustomSnackbar } from '@/src/components/ui/snackbar/Snackbar';

const hasSpecialCharacters = (str: string) =>
  /[!@#$%^&*(),.?":{}|<>]/g.test(str);

interface FiltersProps {
  onFilterChange: (
    searchTerm: string,
    minDate: Date | null,
    maxDate: Date | null
  ) => void;
  initialSearchTerm?: string;
  initialMinDate?: Date | null;
  initialMaxDate?: Date | null;
}

export const Filters: FC<FiltersProps> = ({
  onFilterChange,
  initialSearchTerm = '',
  initialMinDate = null,
  initialMaxDate = null,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [minDate, setMinDate] = useState<Date | null>(initialMinDate);
  const [maxDate, setMaxDate] = useState<Date | null>(initialMaxDate);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'error'
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (hasSpecialCharacters(searchTerm)) {
      setSearchError('Поиск не может содержать специальные символы');
      setSnackbarMessage('Поиск не может содержать специальные символы');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setSearchError(null);
      onFilterChange(debouncedSearchTerm, minDate, maxDate);
    }
  }, [debouncedSearchTerm, minDate, maxDate, onFilterChange, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value.trim()) {
      setSearchError('Поле поиска не должно быть пустым');
      setSnackbarMessage('Поле поиска не должно быть пустым');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setSearchError(null);
    }

    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onFilterChange('', minDate, maxDate);
  };

  const handleDateChange = (
    newMinDate: Date | null,
    newMaxDate: Date | null
  ) => {
    if (newMinDate && newMaxDate && newMinDate > newMaxDate) {
      setSnackbarMessage('Минимальная дата не может быть больше максимальной');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setMinDate(newMinDate);
      setMaxDate(newMaxDate);
    }
  };

  const handleCloseSnackbar = (_: unknown, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box p={2}>
      <TextField
        label="Поиск по имени, фамилии или IDNP"
        value={searchTerm}
        onChange={handleSearchChange}
        error={!!searchError}
        helperText={searchError}
        fullWidth
        InputProps={{
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>X</IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <DatePicker
          selected={minDate}
          onChange={date => handleDateChange(date, maxDate)}
          customInput={
            <TextField value={minDate} label="Минимальная дата" fullWidth />
          }
          dateFormat="dd.MM.yyyy"
          isClearable
          showYearPicker
        />

        <DatePicker
          selected={maxDate}
          onChange={date => handleDateChange(minDate, date)}
          customInput={
            <TextField value={maxDate} label="Максимальная дата" fullWidth />
          }
          dateFormat="dd.MM.yyyy"
          isClearable
          showYearPicker
        />
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Box>
  );
};
