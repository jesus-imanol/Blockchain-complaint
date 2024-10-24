import { Link } from 'react-router-dom';
import './logo.module.scss';

function Logo() {
  return (
    <Link to="/">
      <img src="/vara.svg" alt="LOGO"  />
    </Link>
  );
}

export { Logo };
