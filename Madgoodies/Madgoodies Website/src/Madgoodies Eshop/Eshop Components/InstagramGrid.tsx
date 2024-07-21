 import '../Eshop Component Styles/InstagramGrid.css'; 
 
 const InstagramGrid: React.FC = () => {
    const placeholderCount = 10;
  
    return (
      <div className="instagram-container">
        <h2>Follow @madgoodies on Instagram</h2>
        <div className="instagram-grid">
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div key={index} className="instagram-item placeholder">
              <div className="loading-animation"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default InstagramGrid;