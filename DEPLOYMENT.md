# Inventory ITRF - Deployment Guide for IIS

## Overview
This guide explains how to deploy the Inventory ITRF frontend application to an IIS server.

## Prerequisites
- Windows Server with IIS installed
- URL Rewrite Module for IIS (required for React Router)
- Node.js and npm installed (for building the app)

---

## Step 1: Create Environment File

Create a `.env` file in the `inventoryitrf` folder:

```env
# Development Environment Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## Step 2: Build the Application

### For Development Build:
```bash
cd inventoryitrf
npm install
npm run build
```

### For Production Build:
```bash
cd inventoryitrf
npm install
npm run build:prod
```

This will create a `dist` folder with all the production files.

---

## Step 3: Configure Runtime Settings

After building, navigate to `dist/config.js` and update the API URL:

```javascript
window.APP_CONFIG = {
  API_URL: 'http://your-server-ip:5000/api', // Change this to your backend server URL
  APP_NAME: 'Inventory ITRF',
  VERSION: '1.0.0'
};
```

**Examples:**
- Local network: `http://192.168.1.100:5000/api`
- Same server: `http://localhost:5000/api`
- Domain: `http://inventory-api.yourdomain.com/api`

---

## Step 4: Install URL Rewrite Module (if not installed)

1. Download URL Rewrite Module from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Install it on your server
3. Restart IIS

---

## Step 5: Deploy to IIS

### Option A: Manual Deployment

1. Copy the entire `dist` folder to your server (e.g., `C:\inetpub\wwwroot\inventory-itrf`)

2. Open IIS Manager

3. Create a new website or application:
   - Right-click on **Sites** → **Add Website**
   - **Site name**: Inventory ITRF
   - **Physical path**: `C:\inetpub\wwwroot\inventory-itrf`
   - **Port**: 80 (or your preferred port)
   - Click **OK**

4. Verify `web.config` is present in the root folder (it should be copied from the build)

5. Set Application Pool:
   - Select your site → **Basic Settings** → **Application Pool**
   - Choose **.NET CLR Version**: No Managed Code
   - **Managed Pipeline Mode**: Integrated

### Option B: Using IIS Manager GUI

1. Open IIS Manager
2. Right-click on **Default Web Site** (or your preferred site)
3. Select **Add Application**
4. **Alias**: `inventory` (or your preferred name)
5. **Physical path**: Browse to the `dist` folder
6. Click **OK**

---

## Step 6: Configure Permissions

1. Right-click on your site folder in IIS → **Edit Permissions**
2. Go to **Security** tab
3. Add **IIS_IUSRS** and **IUSR** with **Read & Execute** permissions

---

## Step 7: Test the Deployment

1. Open a browser and navigate to:
   - `http://localhost` (if deployed on port 80)
   - `http://localhost:8080` (if using custom port)
   - `http://your-server-ip`

2. You should see the login page

3. Check browser console (F12) for any errors

---

## Step 8: Backend API Configuration

Make sure your backend API is also deployed and running on the server. Update the `config.js` to point to the correct backend URL.

### Backend Deployment (Quick Reference):

```bash
cd Backend
npm install --production
```

Create `Backend/.env` file:
```env
PORT=5000
DB_SERVER=your_server
DB_DATABASE=InventoryDB
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key-change-this
```

Run backend:
```bash
node src/index.js
```

Or use PM2 for production:
```bash
npm install -g pm2
pm2 start src/index.js --name inventory-api
pm2 save
pm2 startup
```

---

## Configuration Files Reference

### `config.js` (Runtime Configuration)
Located in `dist/config.js` after build. Edit this file to change settings without rebuilding:

```javascript
window.APP_CONFIG = {
  API_URL: 'http://your-server:5000/api',
  APP_NAME: 'Inventory ITRF',
  VERSION: '1.0.0'
};
```

### `.env` (Build-time Configuration)
Located in `inventoryitrf/.env`. Only used during development:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### Issue: Blank page after deployment
**Solution**: 
- Check browser console for errors
- Verify `web.config` is in the dist folder
- Ensure URL Rewrite module is installed

### Issue: 404 errors when refreshing pages
**Solution**: 
- Install URL Rewrite module for IIS
- Verify `web.config` has the correct rewrite rules

### Issue: Cannot connect to API
**Solution**: 
- Check `config.js` has the correct API URL
- Verify backend is running
- Check Windows Firewall allows the backend port

### Issue: Static files not loading
**Solution**: 
- Verify MIME types are configured in `web.config`
- Check file permissions for IIS_IUSRS

---

## Updating the Application

To update the application after making changes:

1. Rebuild the application:
   ```bash
   cd inventoryitrf
   npm run build
   ```

2. Stop the IIS site

3. Replace files in the deployment folder with new `dist` folder contents

4. **Important**: Don't overwrite `config.js` if you have custom settings!

5. Restart the IIS site

---

## Security Considerations

1. **HTTPS**: Enable SSL/TLS in IIS for production
2. **API URL**: Use HTTPS for API connections in production
3. **Firewall**: Configure Windows Firewall to allow only necessary ports
4. **Permissions**: Grant minimal required permissions to IIS users
5. **Updates**: Keep IIS and Windows Server updated

---

## File Structure After Deployment

```
C:\inetpub\wwwroot\inventory-itrf\
├── assets/           # CSS, JS, images
├── config.js         # Runtime configuration (EDIT THIS)
├── index.html        # Main HTML file
├── vite.svg         # Icon
└── web.config       # IIS configuration
```

---

## Support

For issues or questions, please contact your system administrator or refer to:
- IIS Documentation: https://docs.microsoft.com/en-us/iis/
- Vite Build Guide: https://vitejs.dev/guide/build.html

