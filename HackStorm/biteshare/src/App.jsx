import logo from './assets/logo_no_bg.png';
import { useState } from 'react';
function App() {
  const [foodItems, setFoodItems] = useState([]);

  // State for the form
  const [newFood, setNewFood] = useState({ type: '', quantity: '', location: '' });

  // Handle form submission
  const handleDonate = (e) => {
    e.preventDefault();
    const newItem = {
      id: foodItems.length + 1,
      ...newFood,
      status: "Available"
    };
    setFoodItems([newItem, ...foodItems]);
    setNewFood({ type: '', quantity: '', location: '' }); // Reset form
  };

  // Handle claiming food
  const handleClaim = (id) => {
    setFoodItems(foodItems.map(item => 
      item.id === id ? { ...item, status: "Claimed" } : item
    ));
    alert("Food claimed successfully! An email has been sent to the donor.");
  };
  const handleRemove = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };
  

  return (
    <>
      <div className="app-container">
      <header className="navbar">
        <div className='heading-logo'>
        <h1>BiteShare <img src={logo} alt="BiteShare-logo" style={{height: '60px'}}/> </h1>
        <p>Zero Waste. Zero Hunger.</p>
        </div>
      </header>

      <main className="main-content">
        {/* DONOR SECTION */}
        <section className="donate-section">
          <h2>Post Surplus Food</h2>
          <form onSubmit={handleDonate} className="donate-form">
            <input 
              type="text" 
              placeholder="Food Type (e.g. Rice & Dal)" 
              value={newFood.type}
              onChange={(e) => setNewFood({ ...newFood, type: e.target.value.replace(/[0-9]/g, '') })}
              required
            />
            <input 
              type="number" 
              min= "1"
              placeholder="Quantity (e.g. 50 plates)" 
              value={newFood.quantity}
              onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
              required
            />
            <input 
              type="text" 
              placeholder="Location" 
              value={newFood.location}
              onChange={(e) => setNewFood({ ...newFood, location: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Post Alert</button>
          </form>
        </section>

        {/* NGO/RESCUER SECTION */}
        <section className="dashboard-section">
          <h2>Live Food Alerts</h2>
          <div className="card-grid">
            {foodItems.map((item) => (
              <div key={item.id} className={`food-card ${item.status === 'Claimed' ? 'claimed-card' : ''}`}>
                <h3>{item.type}</h3>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Location:</strong> {item.location}</p>
                
         
                {item.status === "Available" ? (
                  <button onClick={() => handleClaim(item.id)} className="btn-claim">
                    Claim Food
                  </button>
                ) : (
                  <div className="claimed-actions">
                    <span className="status-claimed">🔴 Claimed</span>
                    <button onClick={() => handleRemove(item.id)} className="btn-remove">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    </>
  )
}

export default App
