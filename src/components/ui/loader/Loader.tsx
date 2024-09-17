import React, { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import styles from './style.module.scss';

export const Loader: FC = () => {
  return (
    <Box
      className={styles.loaderContainer}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
