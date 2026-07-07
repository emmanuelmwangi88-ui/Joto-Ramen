# 🍜 Joto Ramen Website - Complete Full-Stack Solution

A complete restaurant website with **online ordering system**, **customer reviews**, and **powerful admin panel** for Joto Ramen Nairobi.

## 🚀 Quick Start

### Option 1: Open Website
```
1. Go to the "public" folder
2. Double-click "index.html"
3. Opens in your browser - Done!
```

### Option 2: Access Admin Panel
```
1. Go to the "public" folder
2. Double-click "admin.html"
3. Login with: admin / admin123
```

## 📁 Project Structure

```
public/
├── index.html          # Customer website with ordering
├── styles.css          # Website styles
├── script.js           # Website logic + cart + orders
├── admin.html          # Admin panel with login
├── admin-styles.css    # Admin styles
└── admin.js            # Admin logic (CRUD + orders)
```

## ✨ New Features

### Customer Website Features
| Feature | Description |
|---------|-------------|
| **🛒 Online Ordering** | Add items to cart, place orders for pickup/delivery |
| **Shopping Cart** | Floating cart button, quantity adjustment |
| **Customer Reviews** | Submit reviews with star ratings |
| **Menu** | 10 dishes with filtering and "Add to Order" buttons |
| **Gallery** | 8 images with lightbox zoom |
| **Reservations** | Table booking form |
| **Admin Link** | Small admin login button in nav and footer |

### Admin Panel Powers
| Power | Description |
|-------|-------------|
| **🔐 Secure Login** | Username/password authentication |
| **🍜 Menu Manager** | Add/edit/delete items, update prices, upload images from device |
| **🛒 Orders System** | View all customer orders, confirm/cancel/complete |
| **⭐ Review Moderation** | Approve or delete customer reviews |
| **📷 Gallery Manager** | Upload images from device or URL |
| **📅 Reservations** | View, confirm, cancel bookings |
| **📊 Dashboard** | Statistics, pending orders/reviews badges |
| **⚙️ Settings** | Update restaurant info |

## 🎯 How Online Ordering Works

### For Customers:
1. Browse menu on website
2. Click "Add to Order" on any dish
3. Cart button appears showing items and total
4. Click cart → Review items → Adjust quantities
5. Fill in: Name, Email, Phone, Order Type (Pickup/Delivery)
6. Add delivery address (if delivery)
7. Add special instructions
8. Click "Place Order"
9. Order saved → Admin sees it in panel

### For Admin:
1. Login to admin panel
2. Go to "Orders" section
3. See all orders with status badges
4. **Pending** → Click "Confirm Order"
5. **Confirmed** → Click "Mark as Completed"
6. Can also cancel orders
7. Orders sync with website via localStorage

## 🔐 Admin Login

```
Username: admin
Password: admin123
```

⚠️ **Change these in production!**

## 📋 Admin Capabilities

### Menu Manager
- ✅ Add new menu items with full details
- ✅ Edit existing items (name, price, description, etc.)
- ✅ Delete items
- ✅ Enable/disable items (toggle availability)
- ✅ Set categories (Ramen, Starters, Sides, Drinks)
- ✅ Add tags (Signature, Popular, Vegan, Spicy, Chef's Pick)
- ✅ Set spice levels (0-5)
- ✅ **Upload images from device** (new!)
- ✅ Or use image URLs

### Orders Management
- ✅ View all customer orders
- ✅ Filter by status: All, Pending, Confirmed, Completed, Cancelled
- ✅ See order details: items, total, customer info
- ✅ Order type: Pickup or Delivery (+KSh 200)
- ✅ Delivery addresses
- ✅ Special instructions/notes
- ✅ **Confirm** pending orders
- ✅ **Complete** confirmed orders
- ✅ **Cancel** orders
- ✅ Pending orders badge in sidebar

### Review Moderation
- ✅ View all customer reviews
- ✅ Filter by: All, Pending, Approved
- ✅ Approve reviews to publish on website
- ✅ Delete inappropriate/bad reviews
- ✅ See pending count in sidebar badge
- ✅ Dashboard shows recent pending reviews

### Gallery Manager
- ✅ **Upload images from device** (new!)
- ✅ Or use image URLs
- ✅ Add image descriptions
- ✅ Delete unwanted images
- ✅ View all gallery images in grid

### Reservations
- ✅ View all customer bookings
- ✅ Filter by status (Pending, Confirmed, Cancelled)
- ✅ Confirm pending reservations
- ✅ Cancel reservations
- ✅ See customer contact details

### Dashboard
- ✅ Menu items count
- ✅ Pending orders count (with badge)
- ✅ Pending reviews count (with badge)
- ✅ Gallery images count
- ✅ Reservations count
- ✅ Quick action buttons
- ✅ Recent orders preview
- ✅ Recent pending reviews preview

## 🛒 Shopping Cart Features

- Floating cart button (bottom right)
- Shows item count and total price
- Click to open order modal
- Adjust quantities (+/-)
- Remove items
- Order type selection (Pickup/Delivery)
- Delivery fee calculation (+KSh 200)
- Special instructions field
- Order summary before submission

## 💾 Data Storage & Sync

All data stored in **localStorage** (browser storage):
- `joto_menu` - Menu items
- `joto_customer_reviews` - Customer reviews
- `joto_gallery` - Gallery images
- `joto_reservations` - Reservations
- `joto_orders` - Customer orders
- `joto_admin_logged_in` - Admin session

**Data syncs between index.html and admin.html automatically!**

When admin:
- Adds menu item → Appears on website
- Approves review → Shows on website
- Confirms order → Status updates
- Uploads gallery image → Shows on website

## 📱 Customer Review System

Customers can submit:
- Name (required)
- Email (required)
- Rating 1-5 stars (required)
- Review text (required)
- Favorite dish (optional)

All submissions → **Pending** status → Admin approves → Published on website

## 🎨 Customization

### Add More Menu Items
Edit `script.js` and `admin.js` - add to `menuItems` array:
```javascript
{
    id: 11,
    name: 'Your Dish',
    nameJP: '日本語',
    description: 'Description',
    price: 1500,
    category: 'ramen',
    tags: ['signature'],
    image: 'image-url-or-base64',
    spicy: 0,
    available: true
}
```

### Change Order Settings
Edit `script.js` - `handleOrderSubmit()` function:
- Minimum order amount
- Delivery fee
- Order confirmation message

### Update Admin Credentials
Edit `admin.js` - `handleLogin()` function:
```javascript
if (username === 'admin' && password === 'admin123') {
    // Change these values
}
```

## 🌐 Deployment

### Netlify (Recommended)
```
1. Go to https://app.netlify.com/drop
2. Drag the "public" folder
3. Get your live URL instantly!
```

### GitHub Pages
```
1. Create GitHub repository
2. Upload "public" folder contents
3. Enable GitHub Pages
4. Site live at: username.github.io/repo
```

## 🛡️ Security Notes

For production:
- [ ] Change default admin password
- [ ] Add proper backend authentication
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Sanitize all inputs
- [ ] Add CSRF protection
- [ ] Use environment variables
- [ ] Add payment gateway for online orders
- [ ] Send email/SMS confirmations

## 📊 Content Summary

| Content | Count |
|---------|-------|
| Menu Items | 10 |
| Gallery Images | 8 |
| Sample Reviews | 4 (1 pending) |
| Sample Reservations | 3 |
| Sample Orders | 0 (customers place new ones) |

## 🔧 Technologies

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | Tailwind CSS (CDN) |
| Fonts | Google Fonts (Inter, Noto Serif JP) |
| Icons | Inline SVG |
| Storage | LocalStorage |
| Images | File API (upload from device) |
| Maps | Google Maps Embed |

## 📞 Contact

**Joto Ramen**
- Instagram: [@joto_ramen_nairobi](https://instagram.com/joto_ramen_nairobi)
- Locations: The Alchemist (Westlands) & Lavington Mall
- Hours: Mon-Thu & Sun 12pm-11:30pm, Fri-Sat 12pm-3:30am

## 📝 License

MIT License - Free for educational and commercial use.

---

**Built with ❤️ for Joto Ramen Nairobi**

## 🎯 Quick Tips

1. **Preview Website:** Open `public/index.html`
2. **Access Admin:** Open `public/admin.html` → Login: admin/admin123
3. **Test Ordering:** Add items to cart → Place order → View in admin
4. **Test Reviews:** Submit review → Approve in admin → Shows on website
5. **Upload Images:** Admin → Gallery/Add Menu → Choose file from device
6. **Manage Orders:** Admin → Orders → Confirm/Complete/Cancel
7. **Deploy:** Drag `public` folder to Netlify Drop

## 🚀 Complete Feature List

✅ Customer website with beautiful design
✅ Online ordering system with cart
✅ Shopping cart with quantity adjustment
✅ Pickup and delivery options
✅ Customer review system with moderation
✅ Admin panel with secure login
✅ Menu management (CRUD)
✅ Image upload from device
✅ Order management system
✅ Review moderation
✅ Gallery management
✅ Reservations management
✅ Dashboard with statistics
✅ Real-time data sync between website and admin
✅ Pending badges for orders and reviews
✅ Responsive design (mobile, tablet, desktop)
✅ All data stored in localStorage
