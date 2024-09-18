import { FC, SyntheticEvent } from 'react';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CustomSnackbarProps extends SnackbarProps {
  severity: 'success' | 'error';
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
}

export const CustomSnackbar: FC<CustomSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
