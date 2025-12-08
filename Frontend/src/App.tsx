import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import About from './components/About';
import CustomerList from './components/customer/CustomerList';
import CustomerDetail from './components/customer/CustomerDetail';
import OrderList from './components/order/OrderList';
import ProductList from './components/product/ProductList';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
