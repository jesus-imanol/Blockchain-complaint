import React from 'react';
import { Logo } from './logo';
import { AccountInfo } from './account-info';
import styles from './header.module.scss';
import { MultiWallet } from '@/features/multiwallet/ui/wallet';
import { Link } from 'react-router-dom';
type Props = {
  isAccountVisible: boolean;
};

export function Header({ isAccountVisible }: Props) {
  // const [isMenuOpen] = React.useState(false);

  return (
    <header className={styles.header}>
      <Link to="/report">
      <Logo />
    </Link>
    
      <Link to="/report">
      <p>Realizar denuncia</p>
    </Link>

    <Link to="/get">
      <p>Ver denuncias</p>
    </Link>
      {isAccountVisible && <MultiWallet/>}
    </header>
  );

  
}
