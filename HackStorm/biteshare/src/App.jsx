import { useState, useEffect } from 'react';
import logo from './assets/logo_no_bg.png';

// =========================================
// 1. ISOLATED DONOR FORM
// =========================================
function DonorForm({ onAddFood }) {
  const [newFood, setNewFood] = useState({
    organization: '', phone: '', type: '', quantity: '', location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFood(newFood);
    setNewFood({ organization: '', phone: '', type: '', quantity: '', location: '' });
  };

  return (
    <section className="donate-section glass-panel">
      <h2>Post Surplus Food</h2>
      <p className="subtitle">List extra food immediately for nearby NGOs.</p>

      <form onSubmit={handleSubmit} className="donate-form">
        <div className="input-group">
          <label>Organization / Donor Name</label>
          <input type="text" placeholder="e.g., Amity Mess" value={newFood.organization} onChange={(e) => setNewFood({ ...newFood, organization: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Contact Number</label>
          <input
            type="tel"
            placeholder="e.g., 9876543210"
            value={newFood.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 10) {
                setNewFood({ ...newFood, phone: val });
              }
            }}
            pattern="[0-9]{10}"
            title="Please enter exactly a 10-digit phone number"
            required
          />
        </div>
        <div className="input-group">
          <label>Food Description</label>
          <input type="text" placeholder="e.g., Mixed Veg & Roti" value={newFood.type} onChange={(e) => setNewFood({ ...newFood, type: e.target.value })} required />
        </div>
        <div className="input-group">
          <label>Quantity (Servings)</label>
          <input type="number" placeholder="e.g., 50" value={newFood.quantity} onChange={(e) => { const val = e.target.value; if (val === '' || Number(val) > 0) setNewFood({ ...newFood, quantity: val }); }} required />
        </div>
        <div className="input-group">
          <label>Pickup Location</label>
          <input type="text" placeholder="e.g., Gate 2" value={newFood.location} onChange={(e) => setNewFood({ ...newFood, location: e.target.value })} required />
        </div>
        <button type="submit" className="btn-primary">Broadcast Alert</button>
      </form>
    </section>
  );
}

function AboutUs() {
  return (
    <div className="view-container slide-in">
      <section className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Our Mission</h2>
        <p className="subtitle" style={{ fontSize: '1.2rem', color: '#10b981' }}>Zero Waste. Zero Hunger.</p>
        
        <div style={{ marginTop: '30px', lineHeight: '1.8', fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', textAlign: 'left' }}>
          <p style={{ marginBottom: '15px' }}>Every day, tons of perfectly good surplus food from hostels, restaurants, and events goes to waste, while millions go to bed hungry. BiteShare was built to bridge this gap.</p>
          <p style={{ marginBottom: '15px' }}>We are a real-time, technology-driven logistics platform. By utilizing geospatial data and instant SMTP notifications, we connect donors with surplus food to local NGOs who can rescue it instantly.</p>
          <p style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
            Built with ❤️ by team <strong>HackStorm</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}


function ContactUs() {
  return (
    <div className="view-container slide-in">
      <section className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Get in Touch</h2>
        <p className="subtitle">Partner with us to expand our rescue network.</p>
        
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1.1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>📍 Headquarters:</strong> <br/> Ranchi, India
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>📧 Email:</strong> <br/> jitansaw0416@gmail.com
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>📞 Phone:</strong> <br/> +91 76673 01649
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('donor'); 
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    fetch('http://localhost:5000/api/food')
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleDonate = async (foodData) => {
    try {
      const response = await fetch('http://localhost:5000/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData)
      });
      const newItem = await response.json();
      setFoodItems([newItem, ...foodItems]);
   
      // setActiveTab('ngo');
    } catch (err) {
      console.error("Error posting food:", err);
    }
  };

  const handleClaim = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/food/${id}/claim`, {
        method: 'PUT'
      });

      if (response.status === 409) {
        alert("❌ Sorry! Another NGO just claimed this food a second ago.");
        const res = await fetch('http://localhost:5000/api/food');
        const data = await res.json();
        setFoodItems(data);
        return;
      }

      if (response.ok) {
        setFoodItems(foodItems.map(item => item.id === id ? { ...item, status: "Claimed" } : item));
        alert("✅ Success! You have claimed this food.");
      }
    } catch (err) {
      console.error("Error claiming food:", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/food/${id}`, { method: 'DELETE' });
      setFoodItems(foodItems.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error removing food:", err);
    }
  };

  const filteredFoods = foodItems.filter(item => 
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="navbar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', marginBottom: '30px' }}>
        
        <div className="heading-logo" style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => setActiveTab('donor')}>
          <img src={logo} alt="BiteShare Logo" style={{ height: '50px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#fff', letterSpacing: '1px' }}>BiteShare</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>Zero Waste. Zero Hunger.</p>
          </div>
        </div>

        <nav className="desktop-nav" style={{ display: 'flex', gap: '30px', fontSize: '1rem', fontWeight: '500' }}>
          <span 
            onClick={() => setActiveTab('donor')} 
            style={{ color: (activeTab === 'ngo' || activeTab === 'donor') ? '#10b981' : 'rgba(255,255,255,0.7)', cursor: 'pointer', borderBottom: (activeTab === 'ngo' || activeTab === 'donor') ? '2px solid #10b981' : 'none', paddingBottom: '5px' }}>
            Dashboard
          </span>
          <span 
            onClick={() => setActiveTab('about')} 
            style={{ color: activeTab === 'about' ? '#10b981' : 'rgba(255,255,255,0.7)', cursor: 'pointer', borderBottom: activeTab === 'about' ? '2px solid #10b981' : 'none', paddingBottom: '5px' }}>
            About Us
          </span>
          <span 
            onClick={() => setActiveTab('contact')} 
            style={{ color: activeTab === 'contact' ? '#10b981' : 'rgba(255,255,255,0.7)', cursor: 'pointer', borderBottom: activeTab === 'contact' ? '2px solid #10b981' : 'none', paddingBottom: '5px' }}>
            Contact
          </span>
        </nav>

        <div className="role-toggle" style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            className={`tab-btn ${activeTab === 'donor' ? 'active' : ''}`} 
            onClick={() => setActiveTab('donor')}
            style={{ border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Donor View
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ngo' ? 'active' : ''}`} 
            onClick={() => setActiveTab('ngo')}
            style={{ border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            NGO View
          </button>
        </div>

      </header>

      <main className="main-content">
        
      
        {activeTab === 'donor' && (
          <div className="view-container slide-in">
            <DonorForm onAddFood={handleDonate} />
          </div>
        )}
        {activeTab === 'ngo' && (
          <div className="view-container slide-in">
            <section className="dashboard-section glass-panel">
              <div className="dashboard-header" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>Live Food Alerts</h2>
                  <span className="live-indicator">🟢 Live at Amity University</span>
                </div>
                
                <input 
                  type="text" 
                  placeholder="🔍 Search by food, donor, or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 15px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)',
                    color: 'white', outline: 'none', fontSize: '1rem'
                  }}
                />
              </div>

              <div className="card-grid" style={{ marginTop: '20px' }}>
                {filteredFoods.length === 0 ? (
                  <div className="empty-state glass-panel">
                    <h3>All Clear! 🍏</h3>
                    <p>{searchTerm ? "No matching food found." : "No active alerts right now."}</p>
                  </div>
                ) : (
                  filteredFoods.map((item) => (
                    <div key={item.id} className={`food-card glass-panel ${item.status === 'Claimed' ? 'claimed-card' : ''}`}>
                      <div className="card-header">
                        <h3>{item.type}</h3>
                        <span className="time-posted">{item.timestamp}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Donor:</strong> {item.organization}</p>
                        <p><strong>Quantity:</strong> {item.quantity} servings</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Distance:</strong> 📍 {item.distance}</p>
                        <p><strong>Contact:</strong> 📞 {item.phone}</p>
                      </div>
                      <div className="card-footer">
                        {item.status === "Available" ? (
                          <button onClick={() => handleClaim(item.id)} className="btn-claim">Claim Delivery</button>
                        ) : (
                          <div className="claimed-actions">
                            <span className="status-claimed">✅ Rescued</span>
                            <button onClick={() => handleRemove(item.id)} className="btn-remove">Clear Card</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && <AboutUs />}

        {activeTab === 'contact' && <ContactUs />}

      </main>
    </div>
  );
}

export default App;