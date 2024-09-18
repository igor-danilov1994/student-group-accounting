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
import { StudentsTableRow } from './StudentsTableRow/StudentsTableRow';

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
  const headerRenderer = ({
    label,
    dataKey,
    withSort = true,
  }: TableHeaderProps & { withSort?: boolean }) => (
    <div
      onClick={() => onRequestSort(dataKey as keyof Student)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        fontWeight: 'bold',
      }}
    >
      {label}
      {withSort && (
        <>{orderBy === dataKey && (order === 'asc' ? ' 🔼' : ' 🔽')}</>
      )}
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
        <StudentsTableRow student={student} index={index} />
      </div>
    );
  };

  const cellRenderer = ({ cellData }: TableCellProps) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        textAlign: 'center',
      }}
    >
      {cellData}
    </div>
  );

  if (!students.length) {
    return 'Нет результатов';
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '400px',
          margin: 'auto',
        }}
      >
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
                label="#"
                headerRenderer={props =>
                  headerRenderer({ ...props, withSort: false })
                }
                dataKey="index"
                width={180}
              />
              <Column
                label="Имя"
                dataKey="firstName"
                width={150}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Фамилия"
                dataKey="lastName"
                width={180}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Год рождения"
                dataKey="birthYear"
                width={200}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="Статус"
                dataKey="status"
                width={150}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column
                label="IDNP"
                dataKey="idnp"
                width={200}
                headerRenderer={headerRenderer}
                cellRenderer={cellRenderer}
              />
              <Column width={150} label="Действия" dataKey="id" />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
