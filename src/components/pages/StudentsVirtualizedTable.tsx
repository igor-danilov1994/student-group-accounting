import { CSSProperties, FC } from 'react';
import {
  AutoSizer,
  Column,
  Table,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';
import { Student } from '@/src/types';
import 'react-virtualized/styles.css';
import { StudentsTableRow } from '@/src/components/ui/table/StudentsTableRow/StudentsTableRow';

interface StudentsVirtualizedTableProps {
  students: Student[];
  orderBy: keyof Student;
  order: 'asc' | 'desc';
  onRequestSort: (property: keyof Student) => void;
}

export const StudentsVirtualizedTable: FC<StudentsVirtualizedTableProps> = ({
  students,
  orderBy,
  order,
  onRequestSort,
}) => {
  const headerRenderer = ({ label, dataKey }: TableHeaderProps) => (
    <div
      onClick={() => onRequestSort(dataKey as keyof Student)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px', // Добавляем отступ для заголовков
        fontWeight: 'bold', // Жирный текст для заголовков
      }}
    >
      {label}
      {orderBy === dataKey && (order === 'asc' ? ' 🔼' : ' 🔽')}
    </div>
  );

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: CSSProperties;
  }) => {
    const student = students[index];
    return (
      <div key={key} style={{ ...style, display: 'flex', width: '100%' }}>
        <StudentsTableRow student={student} />
      </div>
    );
  };

  const cellRenderer = ({ cellData }: TableCellProps) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px', // Добавляем отступы для текста внутри ячеек
        textAlign: 'center',
      }}
    >
      {cellData}
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '1200px', height: '500px' }}>
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={70}
              rowRenderer={rowRenderer}
              rowCount={students.length}
              rowGetter={({ index }) => students[index]}
              style={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                width: '100%',
              }}
            >
              <Column
                label="Имя"
                dataKey="firstName"
                width={width * 0.2} // Задаем ширину колонки
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Фамилия"
                dataKey="lastName"
                width={width * 0.2}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Год рождения"
                dataKey="birthYear"
                width={width * 0.15}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Статус"
                dataKey="status"
                width={width * 0.15}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="IDNP"
                dataKey="idnp"
                width={width * 0.2}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                width={width * 0.15}
                label="Действия"
                dataKey="id"
                cellRenderer={({ rowData }) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <StudentsTableRow student={rowData} />
                  </div>
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
