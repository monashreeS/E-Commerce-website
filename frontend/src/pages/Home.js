import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    // FIX: Wrap fetchProducts in useCallback to avoid dependency issues
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const url = `${apiUrl}/products`;
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                handleError('No authentication token found');
                navigate('/login');
                return;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 403) {
                    handleError('Unauthorized. Please login again');
                    localStorage.removeItem('token');
                    localStorage.removeItem('loggedInUser');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Products response:', result);
            
            if (result.success && result.data) {
                setProducts(result.data);
            } else if (Array.isArray(result)) {
                setProducts(result);
            } else {
                setProducts([]);
            }
            
        } catch (err) {
            console.error('Fetch error:', err);
            handleError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [navigate]); // FIX: Added navigate as dependency
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // FIX: Now fetchProducts is included in dependencies

    return (
        <div className='home-container'>
            <div className='header'>
                <h1>Welcome, {loggedInUser || 'User'}</h1>
                <button onClick={handleLogout} className='logout-btn'>
                    Logout
                </button>
            </div>
            
            <div className='products-section'>
                <h2>Products</h2>
                
                {loading && <p className='loading'>Loading products...</p>}
                
                {!loading && products.length === 0 && (
                    <p className='no-products'>No products available</p>
                )}
                
                {!loading && products.length > 0 && (
                    <div className='products-grid'>
                        {products.map((item) => (
                            <div key={item._id} className='product-card'>
                                <h3>{item.name}</h3>
                                <p className='price'>₹ {item.price}</p>
                                {item.description && (
                                    <p className='description'>{item.description}</p>
                                )}
                                {item.category && (
                                    <p className='category'>Category: {item.category}</p>
                                )}
                                <button className='add-to-cart-btn'>
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <ToastContainer />
        </div>
    );
}

export default Home;