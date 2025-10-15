require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const {sequelize,connectDB} = require("./config/db");
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const {startROICron} = require("./modules/invest/cronjobInvestment");
const userRoute = require("./modules/dashboardModules/dashboardRouter");
const authRoute = require("./modules/auth/authRouter");
const depositRoute = require("./modules/depositModule/depositRouter");
const withdrawalRoute = require("./modules/withdrawal/withdrawalRouter");
const investRoute = require("./modules/invest/investRouter");
const adminRoutes = require("./adminModule/adminRoute");
const path = require('path');
const app = express();

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// config
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://www.smartsuppchat.com",
          "https://*.smartsuppcdn.com",
          "'unsafe-inline'"
        ],
        scriptSrcAttr: ["'none'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://*.smartsuppcdn.com",
          "https://fonts.googleapis.com",
          "'unsafe-inline'"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://*.smartsupp.com",
          "https://*.smartsuppcdn.com",
          "https://app.ciqpay.com",
          "https://cdn.pixabay.com"
        ],
        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://*.smartsuppcdn.com",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "data:",
          "http://localhost:1200", // Add for development
          "https://vitron-trade.com/"
        ],
        mediaSrc: [
          "'self'", // Allow media from vitron-trade.com
          "https://*.smartsuppcdn.com"
        ],
        connectSrc: [
          "'self'",
          "https://bootstrap.smartsuppchat.com",
          "https://*.smartsupp.com",
          "https://*.smartsuppchat.com",
          "https://*.smartsuppcdn.com",
          "wss://*.smartsupp.com",
          "wss://websocket-visitors.smartsupp.com", // Explicitly allow Smartsupp WebSocket
          "https://api.coingecko.com",
          "https://cdn.jsdelivr.net", // Added for Bootstrap/Swiper source maps
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        frameSrc: [
          "https://*.smartsupp.com",
          "https://*.smartsuppcdn.com",
          "https://www.youtube.com", // Added for YouTube iframes
          "https://www.youtube-nocookie.com", // Added for YouTube privacy-enhanced iframes
        ],
        // Removed duplicate scriptSrcAttr
        objectSrc: ["'none'"], // Added for security
        upgradeInsecureRequests: [], // Added for HTTPS enforcement
      }
    }
  })
);

app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  if (req.url.endsWith('.mp4')) {
    res.setHeader('Content-Type', 'video/mp4');
  }
  if (req.url.endsWith('.woff2')) {
    res.setHeader('Content-Type', 'font/woff2');
  }
  next();
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

// Basic route example
app.get("/health", async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log(req.ip)
        res.json({
          status: 'UP',
          database: 'CONNECTED',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          status: 'DOWN',
          database: 'DISCONNECTED',
          error: error.message
        });
      }
});

//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/deposit', depositRoute);
app.use('/api/v1/withdrawal', withdrawalRoute);
app.use('/api/v1/invest', investRoute);
app.use("/api/v1/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);


const startServer = async () => {
    const port = process.env.PORT || 1200;
    try {
        await connectDB();
        
        startROICron();
        logger.info('✅ ROI cron job started');

        // Capture the server instance - THIS FIXES THE "Server is not defined" ERROR
        const server = app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`);
            logger.info('⏰ ROI auto-payouts scheduled every 12 hours');
        });

        // Fixed gracefulShutdown function
        const gracefulShutdown = () => {
          console.log('Starting graceful shutdown...');

          if (server && typeof server.close === 'function') {
            server.close(() => {
              console.log('Server stopped!!');
              
              sequelize.close().then(() => {
                console.log("Database connections closed");
                process.exit(0);
              }).catch(err => {
                console.error('Error closing database: ', err);
                process.exit(1);
              });
            });

            // Force shutdown after timeout
            setTimeout(() => {
              console.log('Forcing shutdown after timeout');
              process.exit(1);
            }, 10000);
          } else {
            // If server is not available, just close database and exit
            sequelize.close().then(() => {
              console.log("Database connections closed (no server to close)");
              process.exit(0);
            }).catch(err => {
              console.error('Error closing database: ', err);
              process.exit(1);
            });
          }
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);

    } catch (error) {
        logger.error('Failed to start application:', error);
        console.error(error);
        process.exit(1);
    }
};

startServer();