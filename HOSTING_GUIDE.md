# DFX Studio — Complete Hosting & Deployment Guide

## 📁 Project Structure
```
dfx-studio/
├── server.js              ← Express backend entry point
├── package.json           ← Node.js dependencies
├── .env.example           ← Environment variables template
├── config/
│   └── database.js        ← MongoDB connection
├── models/
│   └── Contact.js         ← Contact form database schema
├── routes/
│   └── contact.js         ← API routes for contact form
└── public/                ← Static frontend files
    ├── index.html         ← Main HTML page
    ├── css/style.css      ← All styles
    ├── js/main.js         ← All JavaScript
    ├── images/            ← Add your photos here
    └── videos/            ← Add your videos here
```

---

## 🖼️ ADD YOUR PHOTOS & VIDEOS

### Images needed (place in /public/images/):
| Filename           | Size (recommended) | Description                  |
|--------------------|-------------------|------------------------------|
| hero1.jpg          | 1920×1080         | Hero slideshow image 1       |
| hero2.jpg          | 1920×1080         | Hero slideshow image 2       |
| hero3.jpg          | 1920×1080         | Hero slideshow image 3       |
| about1.jpg         | 800×900           | About section main photo     |
| about2.jpg         | 600×600           | About section accent photo   |
| service-wedding.jpg| 600×400           | Wedding service card         |
| service-portrait.jpg| 600×400          | Portrait service card        |
| service-commercial.jpg| 600×400        | Commercial service card      |
| service-event.jpg  | 600×400           | Event service card           |
| service-video.jpg  | 600×400           | Video service card           |
| service-baby.jpg   | 600×400           | Baby service card            |
| gallery1-9.jpg     | 800×800           | Gallery images (9 photos)    |
| video-poster1-3.jpg| 800×450           | Video thumbnail posters      |

### Videos needed (place in /public/videos/):
| Filename          | Format | Description           |
|-------------------|--------|-----------------------|
| highlight1.mp4    | MP4    | Wedding highlight reel|
| highlight2.mp4    | MP4    | Commercial video      |
| highlight3.mp4    | MP4    | Event highlight       |

**Tip:** Compress images with https://squoosh.app and videos with Handbrake.

---

## 🛢️ DATABASE SETUP (MongoDB Atlas — Free)

1. Go to https://cloud.mongodb.com
2. Create a free account → Create a free M0 cluster
3. Create a database user (remember username & password)
4. In "Network Access" → Add IP Address → Allow All (0.0.0.0/0)
5. Click "Connect" → "Connect your application"
6. Copy the connection string, it looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

## ⚙️ LOCAL DEVELOPMENT SETUP

```bash
# 1. Navigate to project folder
cd dfx-studio

# 2. Install Node.js dependencies
npm install

# 3. Create .env file (copy from example)
cp .env.example .env

# 4. Edit .env file with your values:
#    MONGODB_URI=<your MongoDB Atlas connection string>
#    EMAIL_USER=<your Gmail>
#    EMAIL_PASS=<your Gmail App Password>
#    EMAIL_TO=<studio email to receive enquiries>

# 5. Start development server
npm run dev

# 6. Open browser at http://localhost:3000
```

---

## 🌐 HOSTING ON A DOMAIN (Production)

### Option A: Railway.app (Recommended — Easiest)
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Push your project to GitHub first:
   ```bash
   git init
   git add .
   git commit -m "Initial DFX Studio"
   git push origin main
   ```
4. Connect Railway to your GitHub repo
5. Add environment variables in Railway dashboard:
   - MONGODB_URI, EMAIL_USER, EMAIL_PASS, EMAIL_TO, NODE_ENV=production
6. Railway auto-deploys and gives you a URL like `dfxstudio.up.railway.app`
7. **Custom Domain**: In Railway → Settings → Domains → Add your domain (e.g., dfxstudio.com)
8. Update DNS at your domain registrar: Add CNAME record pointing to Railway URL

### Option B: Render.com (Free tier available)
1. Go to https://render.com and sign up
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables
5. Deploy → Get URL like `dfxstudio.onrender.com`
6. Custom Domain: Settings → Custom Domains → Add your domain

### Option C: DigitalOcean App Platform
1. Go to https://www.digitalocean.com/products/app-platform
2. Create App → GitHub → Select repo
3. Configure: Node.js, Start command `node server.js`
4. Add environment variables
5. Deploy → Add custom domain

### Option D: VPS (Ubuntu Server — Full control)
```bash
# SSH into your VPS
ssh root@YOUR_SERVER_IP

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone/upload your project to /var/www/dfxstudio
cd /var/www/dfxstudio
npm install
cp .env.example .env
# Edit .env with your values
nano .env

# Start with PM2
pm2 start server.js --name dfxstudio
pm2 startup
pm2 save

# Install Nginx
apt-get install -y nginx

# Nginx config (replace dfxstudio.com with your domain)
cat > /etc/nginx/sites-available/dfxstudio << 'EOF'
server {
    listen 80;
    server_name dfxstudio.com www.dfxstudio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/dfxstudio /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Install SSL (HTTPS) with Let's Encrypt
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d dfxstudio.com -d www.dfxstudio.com
```

---

## 🔧 CUSTOMIZATION CHECKLIST

### Update these details in index.html:
- [ ] Phone number: Search for `+91 98765 43210` → replace with real number
- [ ] Email: Search for `hello@dfxstudio.com` → replace with real email
- [ ] WhatsApp link: Update `wa.me/919876543210` with real number
- [ ] Instagram link: Update `instagram.com/dfxstudio`
- [ ] Facebook link: Update `facebook.com/dfxstudio`
- [ ] YouTube link: Update `youtube.com/@dfxstudio`
- [ ] Location: Nashik, Maharashtra (already set) ✓
- [ ] Google Maps iframe: Update with exact studio address
- [ ] Stats: Change 500+, 6+, 350+ to real numbers
- [ ] Testimonials: Replace with real client names and reviews

### Update .env:
- [ ] MONGODB_URI — your MongoDB Atlas connection string
- [ ] EMAIL_USER — your Gmail/business email
- [ ] EMAIL_PASS — Gmail App Password (not regular password)
- [ ] EMAIL_TO — email where enquiries should arrive

---

## 📧 GMAIL APP PASSWORD SETUP
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App passwords"
4. Select "Mail" → Generate
5. Copy the 16-character password → use as EMAIL_PASS in .env

---

## 📊 VIEW CUSTOMER ENQUIRIES

All form submissions are saved to MongoDB. To view them:

```bash
# API endpoint (after deploying):
GET https://yourdomain.com/api/contact

# Or check MongoDB Atlas → Collections → contacts
```

---

## 🔒 SECURITY NOTES
- Never commit .env to Git (it's in .gitignore)
- Change MONGODB_URI for production
- Keep Node.js dependencies updated: `npm update`
- Enable HTTPS in production (certbot handles this)

---

## 📞 SUPPORT
For hosting help, contact: hello@dfxstudio.com
