import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OrderSummary.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export default function OrderSummary() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [productsCache, setProductsCache] = useState({}); // Cache pour les détails des produits

  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  };

  // Charger les détails d'un produit depuis l'API
  const fetchProductDetails = async (productId) => {
    // Si déjà en cache, retourner directement
    if (productsCache[productId]) {
      return productsCache[productId];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : data.data || [];
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
          setProductsCache(prev => ({ ...prev, [productId]: product }));
          return product;
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    
    return null;
  };

  const loadGuestCart = async () => {
    try {
      const cartKey = 'guest_cart';
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      if (cart.length === 0) {
        setItems([]);
        return;
      }

      // Charger les détails des produits depuis l'API
      const itemsWithDetails = await Promise.all(
        cart.map(async (item) => {
          const product = await fetchProductDetails(item.product_id);
          
          return {
            id: `guest_${item.product_id}_${item.added_at}`,
            product_id: item.product_id,
            quantity: item.quantity || 1,
            price: product?.price || 0,
            product: product ? {
              id: product.id,
              name: product.name || product.name_fr || product.name_en || product.name_ar || t('order_summary.product_deleted'),
              description: product.description || product.description_fr || product.description_en || product.description_ar || '',
              image: product.image || null
            } : {
              id: item.product_id,
              name: t('order_summary.product_deleted'),
              description: '',
              image: null
            }
          };
        })
      );

      setItems(itemsWithDetails);
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setItems([]);
    }
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (token) {
        // Utilisateur connecté: charger depuis l'API
        const res = await fetch(`${API_BASE_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        
        if (res.ok) {
          const data = await res.json();
          setItems(data.data?.items || []);
        } else if (res.status === 401) {
          // Token invalide, utiliser localStorage
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          await loadGuestCart();
        } else {
          throw new Error('Erreur lors du chargement du panier');
        }
      } else {
        // Utilisateur non connecté: charger depuis localStorage
        await loadGuestCart();
      }
    } catch (e) {
      console.error('Error loading cart:', e);
      setError(e.message || 'Erreur lors du chargement du panier');
      // Essayer de charger depuis localStorage en cas d'erreur
      await loadGuestCart();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadCartItems();
    
    // Écouter les événements de mise à jour du panier
    const handleCartUpdate = () => {
      loadCartItems();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    setApplyingPromo(true);
    try {
      // Note: Les codes promo peuvent nécessiter une authentification selon votre backend
      // Pour l'instant, on permet l'application même sans token
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/apply-promo`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ code: promoCode.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPromoApplied({
            code: promoCode.trim(),
            discount: data.discount,
            message: data.message
          });
        } else {
          alert(data.message || 'Code promo invalide');
        }
      } else {
        alert('Erreur lors de l\'application du code promo');
      }
    } catch (e) {
      alert('Erreur lors de l\'application du code promo');
    } finally {
      setApplyingPromo(false);
    }
  };

  const removePromoCode = () => {
    setPromoApplied(null);
    setPromoCode('');
  };

  const total = items.reduce((t, it) => t + toNumber(it.quantity) * toNumber(it.price), 0);
  const count = items.reduce((c, it) => c + toNumber(it.quantity), 0);
  const shippingCost = total > 50 ? 0 : 9.99;
  
  let discountAmount = 0;
  if (promoApplied?.discount) {
    discountAmount = total * (promoApplied.discount / 100);
  }
  
  const finalTotal = total + shippingCost - discountAmount;

  const proceedToCheckout = () => {
    window.location.href = '/checkout';
  };

  const goBackToCart = () => {
    window.location.href = '/cart';
  };

  return (
    <div className="order-summary-page">
      <div className="order-summary-container">
        <header className="order-summary-header">
          <div className="header-content">
            <h1 className="page-title" data-aos="fade-up" data-aos-delay="100">
              💳 {t('order_summary.title')}
            </h1>
            <p className="page-description" data-aos="fade-up" data-aos-delay="200">
              {t('order_summary.description')}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="summary-loading">
            <div className="loading-spinner"></div>
            <p>{t('order_summary.loading')}</p>
          </div>
        ) : error ? (
          <div className="summary-error">
            <div className="error-icon">⚠️</div>
            <h3>{t('order_summary.error')}</h3>
            <p>{error}</p>
            <button className="retry-button" onClick={loadCartItems}>
              {t('order_summary.retry')}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="summary-empty">
            <div className="empty-icon">🛒</div>
            <h3>{t('order_summary.empty')}</h3>
            <p>{t('order_summary.empty_description')}</p>
            <button 
              className="shop-button" 
              onClick={() => window.location.href = '/shop'}
            >
              🛍️ {t('order_summary.discover_shop')}
            </button>
          </div>
        ) : (
          <div className="summary-content">
            <div className="summary-main">
              {/* Items Summary */}
              <div className="items-summary-section">
                <h2>{t('order_summary.ordered_items')} ({count} {t('order_summary.article')}{count > 1 ? 's' : ''})</h2>
                <div className="items-list">
                  {items.map((item, index) => (
                    <div key={item.id} className="summary-item" data-aos="fade-up" data-aos-delay={`${100 + index * 50}`}>
                      <div className="item-info">
                        <h4>{item.product?.name || t('order_summary.product_deleted')}</h4>
                        <p>{t('order_summary.quantity')}: {toNumber(item.quantity)} × {toNumber(item.price).toFixed(2)} DH</p>
                      </div>
                      <div className="item-total">
                        {(toNumber(item.quantity) * toNumber(item.price)).toFixed(2)} DH
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="promo-section">
                <h3>{t('order_summary.promo_code')}</h3>
                {!promoApplied ? (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder={t('order_summary.enter_promo')}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="promo-input"
                    />
                    <button 
                      className="apply-promo-btn"
                      onClick={applyPromoCode}
                      disabled={applyingPromo || !promoCode.trim()}
                    >
                      {applyingPromo ? t('order_summary.applying') : t('order_summary.apply')}
                    </button>
                  </div>
                ) : (
                  <div className="promo-applied">
                    <div className="promo-info">
                      <span className="promo-code">{t('order_summary.code')}: {promoApplied.code}</span>
                      <span className="promo-discount">-{promoApplied.discount}%</span>
                    </div>
                    <button className="remove-promo-btn" onClick={removePromoCode}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="order-summary-card">
              <h3>{t('order_summary.order_summary_label')}</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>{t('order_summary.subtotal')} ({count} {t('order_summary.article')}{count > 1 ? 's' : ''})</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
                
                {promoApplied && (
                  <div className="summary-row discount">
                    <span>{t('order_summary.discount')} ({promoApplied.code})</span>
                    <span>-{discountAmount.toFixed(2)} DH</span>
                  </div>
                )}
                
                <div className="summary-row shipping">
                  <span>
                    {t('order_summary.delivery')}
                    {shippingCost === 0 && <span className="free-shipping"> ({t('order_summary.free')})</span>}
                  </span>
                  <span className={shippingCost === 0 ? 'free' : ''}>
                    {shippingCost === 0 ? t('order_summary.free') : `${shippingCost.toFixed(2)} DH`}
                  </span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="shipping-info">
                    <span className="shipping-note">
                      💡 {t('order_summary.free_shipping_note')}
                    </span>
                  </div>
                )}
                
                <div className="summary-total">
                  <span>{t('order_summary.total')}</span>
                  <span>{finalTotal.toFixed(2)} DH</span>
                </div>
              </div>
              
              <div className="summary-actions">
                <button 
                  className="checkout-btn"
                  onClick={proceedToCheckout}
                >
                  🛒 {t('order_summary.proceed_payment')}
                </button>
                
                <button 
                  className="back-to-cart-btn"
                  onClick={goBackToCart}
                >
                  ← {t('order_summary.back_to_cart')}
                </button>
              </div>
              
              <div className="summary-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🚚</span>
                  <span>{t('order_summary.fast_delivery')}</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔒</span>
                  <span>{t('order_summary.secure_payment')}</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">↩️</span>
                  <span>{t('order_summary.free_return')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
