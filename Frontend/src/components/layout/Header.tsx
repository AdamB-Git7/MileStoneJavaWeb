import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="brand">
          <div className="logo-circle">FS</div>
          <div>
            <p className="brand-name">Fragrance Shop</p>
            <p className="brand-sub">Customers / Products / Orders</p>
          </div>
        </Link>
        <nav>
          <ul className="nav">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/customers">Customers</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/orders">Orders</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
