import { StudentsTable } from '@/src/components/pages';
import styles from './page.module.scss';
import React from 'react';

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <StudentsTable />
      </main>
    </div>
  );
}
