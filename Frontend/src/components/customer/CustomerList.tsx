import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi, orderApi } from '../../services/api';
import Modal from '../common/Modal';
import type { Customer } from '../../types';

type ModalMode = 'add' | 'edit' | 'delete' | null;
type CustomerFormData = Pick<Customer, 'firstName' | 'lastName' | 'email'>;
type FormErrors = Partial<Record<keyof CustomerFormData, string>>;

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [formData, setFormData] = useState<CustomerFormData>({ firstName: '', lastName: '', email: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const f = customers.filter((c) =>
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
    setFiltered(f);
    setPage(1);
  }, [search, customers]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getAll();
      setCustomers(res.data);
      setError(null);
    } catch (e) {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    return errs;
  };

  const openAdd = () => {
    setFormData({ firstName: '', lastName: '', email: '' });
    setFormErrors({});
    setModalMode('add');
  };

  const openEdit = (c: Customer) => {
    setSelected(c);
    setFormData({ firstName: c.firstName, lastName: c.lastName, email: c.email });
    setFormErrors({});
    setModalMode('edit');
  };

  const openDelete = (c: Customer) => {
    setSelected(c);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await customerApi.create(formData);
      } else if (modalMode === 'edit' && selected) {
        await customerApi.update(selected.id, formData);
      }
      await load();
      closeModal();
    } catch (err) {
      setError('Save failed. Check inputs or duplicates.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      setError(null);
      let orderIds: number[] = [];

      try {
        const summary = await customerApi.getSummary(selected.id);
        orderIds = (summary.data.orders ?? []).map((o) => o.id);
      } catch {
        // If we cannot fetch orders, continue with best-effort customer deletion.
      }

      if (orderIds.length) {
        await Promise.all(orderIds.map((orderId) => orderApi.delete(orderId)));
      }

      await customerApi.delete(selected.id);
      await load();
      closeModal();
    } catch (err) {
      setError('Delete failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Customer</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        {search && <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>Clear</button>}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr><td colSpan={3} className="empty">No customers found.</td></tr>
            )}
            {pageItems.map((c) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email}</td>
                <td className="action-buttons">
                  <button className="btn btn-info btn-sm" onClick={() => navigate(`/customers/${c.id}`)}>View</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openDelete(c)}>Delete</button>
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

      <Modal isOpen={modalMode === 'add' || modalMode === 'edit'} onClose={closeModal} title={modalMode === 'edit' ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
              className={formErrors.firstName ? 'error' : ''}
            />
            {formErrors.firstName && <small style={{ color: '#e53e3e' }}>{formErrors.firstName}</small>}
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
              className={formErrors.lastName ? 'error' : ''}
            />
            {formErrors.lastName && <small style={{ color: '#e53e3e' }}>{formErrors.lastName}</small>}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <small style={{ color: '#e53e3e' }}>{formErrors.email}</small>}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title="Delete Customer" size="small">
        <p>Delete {selected?.firstName} {selected?.lastName}? This will also remove all of their orders.</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerList;
