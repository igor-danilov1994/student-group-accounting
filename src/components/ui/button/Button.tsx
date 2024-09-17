import { FC } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';

interface ButtonProps extends MuiButtonProps {}

export const Button: FC<ButtonProps> = props => {
  const {
    onClick,
    variant = 'contained',
    color = 'secondary',
    children,
  } = props;
  return (
    <MuiButton
      sx={{
        zIndex: '0',
      }}
      variant={variant}
      color={color}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
