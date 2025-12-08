import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div>
          <h4>Fragrance Shop</h4>
          <p>Independent fragrance studio curating niche scents, timeless icons, and discovery sets.</p>
          <p>We pack every order in-house with climate-safe storage and careful handling.</p>
        </div>
        <div>
          <h5>Customer Care</h5>
          <ul>
            <li><a href="mailto:care@fragranceshop.test">care@fragranceshop.test</a></li>
            <li>Text or call: (555) 012-1212</li>
            <li>Hours: Mon-Fri, 9a-6p CST</li>
          </ul>
        </div>
        <div>
          <h5>Explore</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/customers">Customer profiles</a></li>
            <li><a href="/orders">Order history</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div>
          <h5>Our Promises</h5>
          <ul>
            <li>Authentic bottles, never decants.</li>
            <li>Eco-minded packing materials.</li>
            <li>30-day scent match support.</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        (c) {year} Fragrance Shop - crafted for fragrance lovers and smooth operations
      </div>
    </footer>
  );
};

export default Footer;
