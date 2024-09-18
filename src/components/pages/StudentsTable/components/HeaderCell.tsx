import { FC } from 'react';
import { Order, Student } from '@/src/types';
import { TableHeaderProps } from 'react-virtualized';

export interface HeaderCellProps extends TableHeaderProps {
  withSort?: boolean;
  orderBy: keyof Student;
  order: Order;
  onRequestSort: (property: keyof Student) => void;
}

export const HeaderCell: FC<HeaderCellProps> = props => {
  const {
    label,
    dataKey,
    orderBy,
    order,
    onRequestSort,
    withSort = true,
  } = props;

  const onClickHandler = () => {
    if (withSort) {
      onRequestSort(dataKey as keyof Student);
    }
  };

  return (
    <div
      onClick={onClickHandler}
      style={{
        cursor: `${withSort ? 'pointer' : 'default'}`,
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
};
