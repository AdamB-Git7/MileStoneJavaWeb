import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { orderApi, productApi } from '../../services/api';
import Modal from '../common/Modal';
import type { Product } from '../../types';

type ModalMode = 'add' | 'edit' | 'delete' | null;

type ProductFormData = {
  name: string;
  brand: string;
  price: string;
  stockQuantity: string;
  concentration: string;
  description: string;
};

type FormErrors = Partial<Record<'name' | 'brand' | 'price' | 'stockQuantity', string>>;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    price: '',
    stockQuantity: '',
    concentration: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [mode, setMode] = useState<ModalMode>(null);

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const f = products.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      (p.concentration || '').toLowerCase().includes(term)
    );
    setFiltered(f);
    setPage(1);
  }, [search, products]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll();
      setProducts(res.data);
      setError(null);
    } catch (e) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Name required';
    if (!formData.brand.trim()) errs.brand = 'Brand required';
    if (formData.price === '' || Number(formData.price) <= 0) errs.price = 'Price must be positive';
    if (formData.stockQuantity === '' || Number(formData.stockQuantity) < 0) errs.stockQuantity = 'Stock cannot be negative';
    return errs;
  };

  const openAdd = () => {
    setFormData({ name: '', brand: '', price: '', stockQuantity: '', concentration: '', description: '' });
    setFormErrors({});
    setMode('add');
  };

  const openEdit = (p: Product) => {
    setSelected(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      price: String(p.price ?? ''),
      stockQuantity: String(p.stockQuantity ?? ''),
      concentration: p.concentration || '',
      description: p.description || '',
    });
    setFormErrors({});
    setMode('edit');
  };

  const openDelete = (p: Product) => {
    setSelected(p);
    setMode('delete');
  };

  const closeModal = () => {
    setMode(null);
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
    const payload: Omit<Product, 'id'> = {
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      concentration: formData.concentration || null,
      description: formData.description || null,
    };
    try {
      if (mode === 'add') await productApi.create(payload);
      if (mode === 'edit' && selected) await productApi.update(selected.id, payload);
      await load();
      closeModal();
    } catch (err) {
      setError('Save failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      setError(null);

      // Some backends block deleting a product that is referenced by orders.
      // Best-effort remove related orders first so the product delete can succeed.
      try {
        const ordersRes = await orderApi.getAll();
        const relatedOrderIds =
          (ordersRes.data || [])
            .filter((o) =>
              (o.products || []).some((p) =>
                (p || '').toLowerCase().includes((selected.name || '').toLowerCase())
              )
            )
            .map((o) => o.id);

        if (relatedOrderIds.length) {
          await Promise.all(relatedOrderIds.map((orderId) => orderApi.delete(orderId)));
        }
      } catch {
        // If we cannot clean up orders, still attempt the product delete below.
      }

      await productApi.delete(selected.id);
      await load();
      closeModal();
    } catch (err) {
      setError('Delete failed. Remove related orders first.');
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Product</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by name, brand, concentration..."
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
              <th>Brand</th>
              <th>Concentration</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && <tr><td colSpan={6} className="empty">No products found.</td></tr>}
            {pageItems.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.concentration || 'N/A'}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td><span className="badge">{p.stockQuantity} in stock</span></td>
                <td className="action-buttons">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openDelete(p)}>Delete</button>
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

      <Modal isOpen={mode === 'add' || mode === 'edit'} onClose={closeModal} title={mode === 'edit' ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <small style={{ color: '#e53e3e' }}>{formErrors.name}</small>}
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input
              value={formData.brand}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, brand: e.target.value })}
              className={formErrors.brand ? 'error' : ''}
            />
            {formErrors.brand && <small style={{ color: '#e53e3e' }}>{formErrors.brand}</small>}
          </div>
          <div className="form-group">
            <label>Concentration</label>
            <input
              value={formData.concentration}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, concentration: e.target.value })}
              placeholder="EDT / EDP / Parfum"
            />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
              className={formErrors.price ? 'error' : ''}
            />
            {formErrors.price && <small style={{ color: '#e53e3e' }}>{formErrors.price}</small>}
          </div>
          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              value={formData.stockQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stockQuantity: e.target.value })}
              className={formErrors.stockQuantity ? 'error' : ''}
            />
            {formErrors.stockQuantity && <small style={{ color: '#e53e3e' }}>{formErrors.stockQuantity}</small>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={mode === 'delete'} onClose={closeModal} title="Delete Product" size="small">
        <p>Delete {selected?.name}?</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
