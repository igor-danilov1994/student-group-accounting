import { CSSProperties } from 'react';
import { Student } from '@/src/types';
import { StudentsTableRow } from './StudentsTableRow/StudentsTableRow';

interface RowRendererProps {
  index: number;
  key: string;
  style: CSSProperties;
  students: Student[];
}

export const RowRenderer = (props: RowRendererProps) => {
  const { index, key, style, students } = props;
  const student = students[index];

  return (
    <div key={key} style={{ ...style, display: 'flex', width: '100%' }}>
      <StudentsTableRow student={student} index={index} />
    </div>
  );
};
