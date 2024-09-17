import React, { FC, useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const isValidIDNP = (idnp: string) =>
  /^[0-9]+$/.test(idnp) && idnp.length === 13;

interface FiltersProps {
  onFilterChange: (
    searchTerm: string,
    minDate: Date | null,
    maxDate: Date | null
  ) => void;
}

export const Filters: FC<FiltersProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null); // Для вывода ошибки

  // Обновляем фильтры при каждом изменении
  useEffect(() => {
    onFilterChange(searchTerm, minDate, maxDate);
  }, [searchTerm, minDate, maxDate, onFilterChange]);

  // Валидация IDNP и установка ошибки
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Если IDNP содержит спецсимволы или не состоит из 13 цифр, показать ошибку
    if (value && !isValidIDNP(value)) {
      setSearchError('IDNP должен состоять из 13 цифр');
    } else {
      setSearchError(null);
    }
  };

  // Валидация дат
  const handleDateChange = (
    newMinDate: Date | null,
    newMaxDate: Date | null
  ) => {
    if (newMinDate && newMaxDate && newMinDate > newMaxDate) {
      alert('Минимальная дата не может быть больше максимальной');
    } else {
      setMinDate(newMinDate);
      setMaxDate(newMaxDate);
    }
  };

  return (
    <Box p={2}>
      {/* Поле поиска с валидацией IDNP */}
      <TextField
        label="Поиск по имени, фамилии или IDNP"
        value={searchTerm}
        onChange={handleSearchChange}
        error={!!searchError}
        helperText={searchError}
        fullWidth
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <DatePicker
          selected={minDate}
          onChange={date => handleDateChange(date, maxDate)}
          customInput={<TextField label="Минимальная дата" fullWidth />}
          dateFormat="dd.MM.yyyy"
          isClearable
        />

        <DatePicker
          selected={maxDate}
          onChange={date => handleDateChange(minDate, date)}
          customInput={<TextField label="Максимальная дата" fullWidth />}
          dateFormat="dd.MM.yyyy"
          isClearable
        />
      </Box>
    </Box>
  );
};
