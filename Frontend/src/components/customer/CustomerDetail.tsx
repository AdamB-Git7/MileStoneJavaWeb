import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi } from '../../services/api';
import type { Customer, OrderSummary } from '../../types';

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [id]);

  const load = async () => {
    if (!id) {
      setError('Customer not found.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await customerApi.getSummary(id);
      setCustomer({
        id: res.data.id,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
      });
      setOrders(res.data.orders || []);
      setError(null);
    } catch (e) {
      setError('Failed to load customer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading customer...</div>;
  if (error || !customer) return <div className="error">{error || 'Customer not found.'}</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <p className="pill">Customer #{customer.id}</p>
          <h1>{customer.firstName} {customer.lastName}</h1>
          <p style={{ color: '#4a5568' }}>{customer.email}</p>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => navigate('/customers')}>Back</button>
        </div>
      </div>

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <label>First Name</label>
            <p>{customer.firstName}</p>
          </div>
          <div className="detail-item">
            <label>Last Name</label>
            <p>{customer.lastName}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{customer.email}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <h2 style={{ margin: 0 }}>Orders</h2>
          <button className="btn btn-success btn-sm" onClick={() => navigate('/orders')}>Create / Manage Orders</button>
        </div>
        {orders.length === 0 && <div className="empty">No orders for this customer yet.</div>}
        {orders.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>${Number(o.totalAmount ?? 0).toFixed(2)}</td>
                  <td>{o.dateCreated || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
