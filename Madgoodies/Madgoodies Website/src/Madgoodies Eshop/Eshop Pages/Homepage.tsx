import '../Eshop Component Styles/Homepage.css';

const HomePage = () => {
  return (
    <>
      <div className="Homepage-product-showcase">
        <h2>Our Products</h2>
        <p>For more than 25 years, Magnolia Bakery has been making America’s favorite baked goods the old-fashioned way: from scratch, in small batches, and using the finest ingredients.</p>
        <button>VIEW MORE</button>
        
        <div className="product-carousel">
          <div className="product-item">
            <img src="/path/to/sampler-packs.jpg" alt="Sampler Packs" />
            <h3>Sampler Packs</h3>
          </div>
          <div className="product-item">
            <img src="/path/to/world-famous-banana-pudding.jpg" alt="World-Famous Banana Pudding" />
            <h3>World-Famous Banana Pudding</h3>
          </div>
          <div className="product-item">
            <img src="/path/to/cupcakes.jpg" alt="Cupcakes" />
            <h3>Cupcakes</h3>
          </div>
          <div className="product-item">
            <img src="/path/to/brownies-bars.jpg" alt="Brownies & Bars" />
            <h3>Brownies & Bars</h3>
          </div>
          <div className="product-item">
            <img src="/path/to/cakes.jpg" alt="Cakes" />
            <h3>Cakes</h3>
          </div>
        </div>
      </div>

      <h2>Follow @madgoodies.ph on Instagram</h2>
      <div className="Homepage-social-grid">
        {/* INSERT GRID POST */}
      </div>
    </>
  );
};

export default HomePage;
