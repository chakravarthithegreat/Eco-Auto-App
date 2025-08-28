# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Sign up for a free account**
3. **Create a new project**

## Step 2: Create a Cluster

1. **Click "Build a Database"**
2. **Choose "FREE" tier (M0)**
3. **Select your preferred cloud provider (AWS/Google Cloud/Azure)**
4. **Choose a region close to you**
5. **Click "Create"**

## Step 3: Set Up Database Access

1. **Go to "Database Access" in the left sidebar**
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Create a username and password (save these!)**
5. **Set privileges to "Read and write to any database"**
6. **Click "Add User"**

## Step 4: Set Up Network Access

1. **Go to "Network Access" in the left sidebar**
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere" (for development)**
4. **Click "Confirm"**

## Step 5: Get Your Connection String

1. **Go back to "Database"**
2. **Click "Connect" on your cluster**
3. **Choose "Connect your application"**
4. **Copy the connection string**

## Step 6: Update Connection String

Replace the placeholder values in your connection string:

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/artgifts_manufacturing?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_USERNAME` with your database username
- `YOUR_PASSWORD` with your database password
- `cluster0.xxxxx.mongodb.net` will be your actual cluster URL

## Step 7: Use in Cloud Deployment

Add this connection string as the `MONGODB_URI` environment variable in your cloud platform (Railway, Render, etc.).

## Security Notes

- ✅ Use a strong password
- ✅ In production, restrict IP access to your app's IP
- ✅ Consider using MongoDB Atlas App Services for additional security
- ✅ Regularly rotate database passwords

## Testing Connection

Once deployed, test your connection by visiting:
`https://your-backend-url.railway.app/health`

You should see: `{"status":"OK","message":"Eco-Auto App Backend is running"}`
