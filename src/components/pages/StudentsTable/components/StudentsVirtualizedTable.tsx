import { FC, useCallback } from 'react';
import {
  AutoSizer,
  Column,
  Table,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';
import { Order, Student } from '@/src/types';
import 'react-virtualized/styles.css';
import { HeaderCell, RowRenderer } from '../components';

interface StudentsVirtualizedTableProps {
  students: Student[];
  orderBy: keyof Student;
  order: Order;
  onRequestSort: (property: keyof Student) => void;
}

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

export const StudentsVirtualizedTable: FC<
  StudentsVirtualizedTableProps
> = props => {
  const { students, orderBy, order, onRequestSort } = props;

  const headerRenderer = useCallback(
    (data: TableHeaderProps & { withSort?: boolean }) => (
      <HeaderCell
        label={data.label}
        order={order}
        orderBy={orderBy}
        dataKey={data.dataKey}
        onRequestSort={onRequestSort}
        withSort={data.withSort}
      />
    ),
    [order, orderBy, onRequestSort]
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
              rowRenderer={props => (
                <RowRenderer {...props} students={students} />
              )}
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
