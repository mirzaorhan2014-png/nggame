# NGGames Deployment Guide 🚀

This guide will help you deploy NGGames to production.

## Prerequisites

- Node.js 18+ installed on server
- MongoDB instance (local or cloud like MongoDB Atlas)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)
- Cloud hosting (AWS, DigitalOcean, Heroku, etc.)

## Deployment Options

### Option 1: Traditional Server (VPS/Dedicated)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (if using local)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Clone and Setup

```bash
# Clone repository
git clone https://github.com/mirzaorhan2014-png/nggame.git
cd nggame

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
cd client && npm run build && cd ..
```

#### 3. Configure Environment

```bash
# Create production .env file
nano .env
```

Add production configuration:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nggames
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nggames

JWT_SECRET=generate_a_strong_random_secret_here
SESSION_SECRET=generate_another_strong_random_secret

CLIENT_URL=https://yourdomain.com

INITIAL_COINS=100
WIN_COINS=10
TOURNAMENT_WIN_COINS=100

# Optional: AI API key
# OPENAI_API_KEY=your_openai_api_key
```

#### 4. Start Application with PM2

```bash
# Start server
pm2 start server/index.js --name nggames-server

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 5. Setup Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/nggames
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Serve React frontend
    location / {
        root /path/to/nggame/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket support for Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nggames /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy server code
COPY server ./server

EXPOSE 5000

CMD ["node", "server/index.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: nggames

  backend:
    build: .
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/nggames
      - JWT_SECRET=${JWT_SECRET}
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - mongodb

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./client/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 3. Deploy with Docker

```bash
# Build frontend
cd client && npm run build && cd ..

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create nggames-platform

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Node.js environment
3. Add environment variables
4. Add MongoDB database
5. Deploy automatically

#### AWS (Elastic Beanstalk)

1. Install AWS CLI and EB CLI
2. Initialize EB application
3. Configure environment
4. Deploy with `eb deploy`

## Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI in .env

### Local MongoDB

```bash
# Install MongoDB
# (See server setup above)

# Create database and user
mongo
use nggames
db.createUser({
  user: "nggames_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "nggames" }]
})
```

## Performance Optimization

### Backend Optimization

1. **Enable compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add caching**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Database indexing**
- User queries: username, email
- Leaderboard queries: gameId, score
- Social queries: user IDs

### Frontend Optimization

1. **Code splitting** (already configured with Vite)
2. **Image optimization**
3. **Lazy loading components**
4. **Service Worker for PWA**

## Monitoring and Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs nggames-server

# Restart app
pm2 restart nggames-server
```

### Log Management

```javascript
// Add winston for logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/nggames" --out="/backups/nggames_$DATE"
```

```bash
# Make executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup.sh
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (ufw/iptables)
- [ ] Keep dependencies updated
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB network access
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your domain
- [ ] Implement rate limiting
- [ ] Regular security audits

## Scaling

### Horizontal Scaling

1. **Load Balancer** (Nginx/HAProxy)
2. **Multiple backend instances**
3. **Redis for session storage**
4. **CDN for static assets**

### Vertical Scaling

1. Increase server resources
2. Optimize database queries
3. Add database indexes
4. Implement caching

## Troubleshooting

### Common Issues

**Cannot connect to MongoDB**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in .env
- Check firewall rules

**Socket.io not connecting**
- Ensure WebSocket support in Nginx
- Check CORS configuration
- Verify port is open

**Build errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Useful Commands

```bash
# Check server logs
pm2 logs nggames-server

# Restart services
pm2 restart all

# Check ports
sudo netstat -tulpn | grep LISTEN

# Check MongoDB status
sudo systemctl status mongod

# Test API
curl http://localhost:5000/api/health
```

## Post-Deployment

1. Test all features
2. Monitor error logs
3. Setup analytics
4. Configure backups
5. Document custom configurations
6. Share with community!

---

Need help? Open an issue on GitHub!