import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

const PackagingModal = ({ isOpen, onRequestClose, productId, onPackagingAdded }) => {
  const [packageQuantity, setPackageQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPackages, setExistingPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      fetchExistingPackages();
    }
  }, [isOpen, productId]);
  
  const fetchExistingPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://localhost:7162/api/good/${productId}/packaging`);
      console.log('Fetched packages:', response.data); // Add this log
      setExistingPackages(response.data);
    } catch (error) {
      console.error('Error fetching existing packages:', error);
      toast.error('Failed to fetch existing packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`https://localhost:7162/api/good/${productId}/packaging`, {
        packageQuantity: parseInt(packageQuantity, 10)
      });
     
      toast.success('Packaging added successfully');
      onPackagingAdded();
      fetchExistingPackages();
      setPackageQuantity('');
    } catch (error) {
      console.error('Error adding packaging:', error);
      toast.error('Failed to add packaging');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (packageId) => {
    try {
      await axios.delete(`https://localhost:7162/api/good/${productId}/packaging/${packageId}`);
      toast.success('Package deleted successfully');
      fetchExistingPackages(); // Refetch after deletion
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Manage Packaging"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Manage Packaging</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="packageQuantity">Package Quantity:</label>
          <input
            type="number"
            id="packageQuantity"
            value={packageQuantity}
            onChange={(e) => setPackageQuantity(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Packaging'}
          </button>
        </div>
      </form>

      <h3>Existing Packages</h3>
{isLoading ? (
  <p>Loading...</p>
) : (
  <ul>
    {existingPackages.map((pack) => (
      <li key={pack.packagingID || pack}>
        Quantity: {pack.packageQuantity || pack}
        <button onClick={() => handleDelete(pack.packagingID || pack)}>Delete</button>
      </li>
    ))}
  </ul>
)}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default PackagingModal;