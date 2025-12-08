import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { customerApi, orderApi, productApi } from '../../services/api';
import Modal from '../common/Modal';
import type { Customer, OrderPayload, OrderSummary, Product } from '../../types';

type ModalMode = 'add' | 'edit' | 'delete' | null;

type OrderFormData = {
  customerId: string;
  productIds: number[];
};

const OrderList = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [mode, setMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<OrderSummary | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({ customerId: '', productIds: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const f = orders.filter((o) =>
      (o.customerName || '').toLowerCase().includes(term) ||
      (o.products || []).some((p) => p.toLowerCase().includes(term))
    );
    setFiltered(f);
    setPage(1);
  }, [search, orders]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [oRes, cRes, pRes] = await Promise.all([
        orderApi.getAll(),
        customerApi.getAll(),
        productApi.getAll(),
      ]);
      setOrders(oRes.data);
      setCustomers(cRes.data);
      setProducts(pRes.data);
      setError(null);
    } catch (e) {
      setError('Failed to load orders or related data.');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setFormData({ customerId: '', productIds: [] });
    setMode('add');
  };

  const openEdit = (o: OrderSummary) => {
    setSelected(o);
    setFormData({ customerId: '', productIds: [] }); // backend does not return product IDs
    setMode('edit');
  };

  const openDelete = (o: OrderSummary) => {
    setSelected(o);
    setMode('delete');
  };

  const closeModal = () => {
    setMode(null);
    setSelected(null);
    setSubmitting(false);
  };

  const toggleProduct = (id: number) => {
    setFormData((prev) => {
      const exists = prev.productIds.includes(id);
      return {
        ...prev,
        productIds: exists ? prev.productIds.filter((pid) => pid !== id) : [...prev.productIds, id],
      };
    });
  };

  const selectedProducts = useMemo(
    () => products.filter((p) => formData.productIds.includes(p.id)),
    [formData.productIds, products]
  );

  const totalAmount = selectedProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.customerId || formData.productIds.length === 0) {
      setError('Customer and at least one product are required.');
      return;
    }
    setSubmitting(true);
    const payload: OrderPayload = {
      customerId: Number(formData.customerId),
      productIds: formData.productIds.map(Number),
    };
    try {
      if (mode === 'add') {
        await orderApi.create(payload);
      } else if (mode === 'edit' && selected) {
        await orderApi.update(selected.id, payload);
      }
      await loadAll();
      closeModal();
    } catch (err) {
      setError('Save failed. Ensure selections are valid.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await orderApi.delete(selected.id);
      await loadAll();
      closeModal();
    } catch (err) {
      setError('Delete failed.');
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={openAdd}>Create Order</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by customer or product..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        {search && <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>Clear</button>}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && <tr><td colSpan={6} className="empty">No orders found.</td></tr>}
            {pageItems.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customerName || 'N/A'}</td>
                <td>
                  <div className="list-tags">
                    {(o.products || []).map((p, idx) => (
                      <span key={idx} className="badge">{p}</span>
                    ))}
                  </div>
                </td>
                <td>${Number(o.totalAmount || 0).toFixed(2)}</td>
                <td>{o.dateCreated || 'N/A'}</td>
                <td className="action-buttons">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(o)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openDelete(o)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > perPage && (
          <div className="pagination">
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page} of {totalPages} ({filtered.length} total)</span>
            <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      <Modal isOpen={mode === 'add' || mode === 'edit'} onClose={closeModal} title={mode === 'edit' ? 'Edit Order' : 'Create Order'} size="large">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer *</label>
            <select
              value={formData.customerId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, customerId: e.target.value })}
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Products *</label>
            <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem' }}>
              {products.map((p) => (
                <label key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <span>
                    <input
                      type="checkbox"
                      checked={formData.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {p.name} - {p.brand} ({p.concentration || 'N/A'})
                  </span>
                  <span className="pill">${Number(p.price).toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Preview Total</label>
            <div className="pill">${totalAmount.toFixed(2)}</div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Order'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={mode === 'delete'} onClose={closeModal} title="Delete Order" size="small">
        <p>Delete order #{selected?.id}?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderList;
