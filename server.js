/* ========================================
   JOTO RAMEN - Backend Server
   ======================================== */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// Database Setup
// ========================================

const db = new sqlite3.Database('./joto_ramen.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('🗄️  Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Reservations table
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            guests INTEGER NOT NULL,
            location TEXT NOT NULL,
            requests TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating reservations table:', err.message);
        } else {
            console.log('✅ Reservations table ready');
        }
    });

    // Contact messages table
    db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating contact_messages table:', err.message);
        } else {
            console.log('✅ Contact messages table ready');
        }
    });

    // Newsletter subscribers table
    db.run(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating newsletter_subscribers table:', err.message);
        } else {
            console.log('✅ Newsletter subscribers table ready');
        }
    });

    // Menu items table (for CMS functionality)
    db.run(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_jp TEXT,
            description TEXT,
            price INTEGER NOT NULL,
            category TEXT NOT NULL,
            tags TEXT,
            image_url TEXT,
            is_available INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating menu_items table:', err.message);
        } else {
            console.log('✅ Menu items table ready');
            seedMenuItems();
        }
    });
}

// Seed initial menu items
function seedMenuItems() {
    db.get("SELECT COUNT(*) as count FROM menu_items", (err, row) => {
        if (err) {
            console.error('Error checking menu items:', err.message);
            return;
        }
        
        if (row.count === 0) {
            const menuItems = [
                { name: 'Special Shoyu', name_jp: '特製醤油', description: 'Clean, light soy-based broth with gentle smokiness, pulled chicken, pork belly, and seaweed.', price: 1850, category: 'ramen', tags: 'signature', image_url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600' },
                { name: 'Special Miso', name_jp: '特製味噌', description: 'Richer and bolder — miso paste, corn, ground meat, seared chashu pork, and spring onions.', price: 1850, category: 'ramen', tags: 'signature,popular', image_url: 'https://images.unsplash.com/photo-1626804475297-411dbe6373b3?w=600' },
                { name: 'Vegan Ramen', name_jp: 'ビーガンラーメン', description: 'Plant-based broth with seasonal vegetables, tofu, and handmade noodles.', price: 1650, category: 'ramen', tags: 'vegan', image_url: 'https://images.unsplash.com/photo-1546060754-72d961c45a45?w=600' },
                { name: 'Spicy Miso', name_jp: '辛味噌', description: 'Our signature miso with an extra kick of chili oil and spicy ground pork.', price: 1950, category: 'ramen', tags: 'spicy', image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600' },
                { name: 'Karaage', name_jp: '唐揚げ', description: 'Japanese fried chicken, crispy on the outside, juicy inside.', price: 850, category: 'starters', tags: '', image_url: 'https://images.unsplash.com/photo-1580476262798-bddd9dd90e3e?w=600' },
                { name: 'Edamame', name_jp: '枝豆', description: 'Steamed soybeans with sea salt.', price: 450, category: 'starters', tags: 'vegan', image_url: 'https://images.unsplash.com/photo-1596519415180-2624a8b2e5bb?w=600' },
                { name: 'Tornado Potatoes', name_jp: 'トルネードポテト', description: 'Crispy spiral-cut potatoes on a stick.', price: 650, category: 'sides', tags: 'vegan', image_url: 'https://images.unsplash.com/photo-1600205735056-04b2c0842a39?w=600' },
                { name: 'Gyoza', name_jp: '餃子', description: 'Pan-fried pork dumplings with crispy bottoms.', price: 750, category: 'starters', tags: '', image_url: 'https://images.unsplash.com/photo-1623970533845-5b5e000a1e68?w=600' },
                { name: 'Japanese Green Tea', name_jp: '緑茶', description: 'Authentic sencha green tea, hot or iced.', price: 350, category: 'drinks', tags: 'vegan', image_url: 'https://images.unsplash.com/photo-1556816907-6c74f5e6e5a4?w=600' },
                { name: 'Ramune', name_jp: 'ラムネ', description: 'Classic Japanese soda in various flavors.', price: 400, category: 'drinks', tags: 'vegan', image_url: 'https://images.unsplash.com/photo-1557862921-3789c8b971ae?w=600' }
            ];

            const stmt = db.prepare(`
                INSERT INTO menu_items (name, name_jp, description, price, category, tags, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            menuItems.forEach(item => {
                stmt.run(item.name, item.name_jp, item.description, item.price, item.category, item.tags, item.image_url);
            });

            stmt.finalize();
            console.log('✅ Menu items seeded');
        }
    });
}

// ========================================
// API Routes
// ========================================

// Get all menu items
app.get('/api/menu', (req, res) => {
    const { category } = req.query;
    let query = "SELECT * FROM menu_items WHERE is_available = 1";
    const params = [];
    
    if (category && category !== 'all') {
        query += " AND category = ?";
        params.push(category);
    }
    
    query += " ORDER BY category, price";
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, data: rows });
    });
});

// Create reservation
app.post('/api/reservations', (req, res) => {
    const { name, email, phone, date, time, guests, location, requests } = req.body;
    
    if (!name || !email || !phone || !date || !time || !guests || !location) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    const sql = `
        INSERT INTO reservations (name, email, phone, date, time, guests, location, requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [name, email, phone, date, time, guests, location, requests || ''], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        res.json({ 
            success: true, 
            message: 'Reservation request submitted successfully!',
            reservationId: this.lastID
        });
    });
});

// Get all reservations (for admin)
app.get('/api/reservations', (req, res) => {
    const { status, date } = req.query;
    let query = "SELECT * FROM reservations ORDER BY created_at DESC";
    const params = [];
    
    if (status) {
        query = "SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC";
        params.push(status);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, data: rows });
    });
});

// Update reservation status
app.put('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
    }
    
    db.run("UPDATE reservations SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Reservation updated' });
    });
});

// Subscribe to newsletter
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    
    db.run("INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)", [email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Successfully subscribed to newsletter!' });
    });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    db.run("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", 
        [name, email, message], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Message sent successfully!' });
        });
});

// Get statistics (for admin dashboard)
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    db.get("SELECT COUNT(*) as count FROM reservations", [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        stats.totalReservations = row.count;
        
        db.get("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'", [], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            stats.pendingReservations = row.count;
            
            db.get("SELECT COUNT(*) as count FROM newsletter_subscribers", [], (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                stats.subscribers = row.count;
                
                res.json({ success: true, data: stats });
            });
        });
    });
});

// ========================================
// Serve Frontend
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
    console.log('');
    console.log('🍜 ========================================');
    console.log('   JOTO RAMEN Server Running');
    console.log('🍜 ========================================');
    console.log(`   🌐 Local:   http://localhost:${PORT}`);
    console.log(`   📁 Public:  ${path.join(__dirname, 'public')}`);
    console.log(`   🗄️  Database: ${path.join(__dirname, 'joto_ramen.db')}`);
    console.log('🍜 ========================================');
    console.log('');
    console.log('📍 Routes:');
    console.log('   GET  /              - Homepage');
    console.log('   GET  /api/menu      - Get menu items');
    console.log('   POST /api/reservations - Create reservation');
    console.log('   GET  /api/reservations - Get all reservations');
    console.log('   POST /api/newsletter   - Subscribe to newsletter');
    console.log('   POST /api/contact      - Contact form');
    console.log('   GET  /admin            - Admin dashboard');
    console.log('🍜 ========================================');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        console.log('\n🗄️  Database connection closed');
        process.exit(0);
    });
});
