import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="page-header">
        <div>
          <p className="pill">Milestone 2 - Full Stack</p>
          <h1>Fragrance Shop Dashboard</h1>
          <p style={{ color: '#4a5568' }}>
            Manage customers, curated products, and customer orders end-to-end.
          </p>
        </div>
      </div>

      <div
        className="home-grid"
        style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
      >
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2>Customers</h2>
          <p>Capture customer profiles, emails, and manage their order history.</p>
          <Link to="/customers" className="btn btn-primary">Manage Customers</Link>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2>Products</h2>
          <p>Maintain catalog details like brand, concentration, price, and stock.</p>
          <Link to="/products" className="btn btn-info">Manage Products</Link>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2>Orders</h2>
          <p>Create and update orders by combining customers with selected fragrances.</p>
          <Link to="/orders" className="btn btn-success">Manage Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
