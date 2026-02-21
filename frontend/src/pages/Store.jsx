import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Store.css';

const Store = () => {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState({ inventory: {}, equipped: {} });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
    if (user && !user.isGuest) {
      fetchInventory();
    }
  }, [filter]);

  const fetchItems = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await axios.get('/api/store/items', { params });
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/store/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const handlePurchase = async (itemId) => {
    if (user.isGuest) {
      alert('You must have an account to purchase items!');
      return;
    }

    try {
      await axios.post(`/api/store/purchase/${itemId}`);
      alert('Item purchased successfully!');
      fetchItems();
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    }
  };

  const handleEquip = async (itemId) => {
    try {
      await axios.put(`/api/store/equip/${itemId}`);
      alert('Item equipped!');
      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to equip item');
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      Common: '#a0a0b0',
      Rare: '#00ffff',
      Epic: '#ff00ff',
      Legendary: '#ffff00'
    };
    return colors[rarity] || '#ffffff';
  };

  if (loading) {
    return <div className="loading">Loading store...</div>;
  }

  return (
    <div className="store-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
        <div className="navbar-user">
          <span className="user-coins">💰 {user?.coins || 0} Coins</span>
        </div>
      </nav>

      <div className="container">
        <div className="store-header">
          <h1>🛒 Item Store</h1>
          <p>Customize your profile with exclusive items</p>
        </div>

        <div className="store-filters glass">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Items
          </button>
          <button 
            className={filter === 'profileFrame' ? 'active' : ''}
            onClick={() => setFilter('profileFrame')}
          >
            Profile Frames
          </button>
          <button 
            className={filter === 'nameEffect' ? 'active' : ''}
            onClick={() => setFilter('nameEffect')}
          >
            Name Effects
          </button>
          <button 
            className={filter === 'avatar' ? 'active' : ''}
            onClick={() => setFilter('avatar')}
          >
            Avatars
          </button>
          <button 
            className={filter === 'weaponSkin' ? 'active' : ''}
            onClick={() => setFilter('weaponSkin')}
          >
            Weapon Skins
          </button>
          <button 
            className={filter === 'bulletEffect' ? 'active' : ''}
            onClick={() => setFilter('bulletEffect')}
          >
            Bullet Effects
          </button>
        </div>

        <div className="store-grid grid grid-4">
          {items.length > 0 ? (
            items.map((item) => {
              const owned = inventory.inventory[`${item.type}s`]?.some(
                i => i._id === item._id
              );
              const equipped = inventory.equipped[item.type]?._id === item._id;

              return (
                <div key={item._id} className="store-item glass">
                  <div className="item-icon" style={{ color: getRarityColor(item.rarity) }}>
                    {item.type === 'profileFrame' && '🖼️'}
                    {item.type === 'nameEffect' && '✨'}
                    {item.type === 'avatar' && '👤'}
                    {item.type === 'weaponSkin' && '🔫'}
                    {item.type === 'bulletEffect' && '💫'}
                  </div>
                  <h3>{item.name}</h3>
                  <p className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                    {item.rarity}
                  </p>
                  <p className="item-description">{item.description}</p>
                  <div className="item-footer">
                    <span className="item-price">💰 {item.price}</span>
                    {equipped ? (
                      <button className="btn btn-success" disabled>
                        ✓ Equipped
                      </button>
                    ) : owned ? (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleEquip(item._id)}
                      >
                        Equip
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handlePurchase(item._id)}
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-items">
              <p>No items found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
