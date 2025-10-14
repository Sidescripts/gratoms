
const cron = require('node-cron');
const { ROIService } = require('./investmentServices');
const logger = require('../../utils/logger');

function startROICron() {
    let cronSchedule = '0 0 * * *'; // Run daily at midnight UTC
    let scheduleDescription = 'Daily at 00:00 UTC';
    
    // Override for development
    if (process.env.NODE_ENV === 'development') {
        cronSchedule = '0 */1 * * *'; // Every hour for testing
        scheduleDescription = 'Every hour (development mode)';
    }
    
    // Schedule the cron job
    cron.schedule(cronSchedule, async function() {
        try {
            const startTime = new Date();
            logger.info(`🕛 Starting scheduled ROI payout check at ${startTime.toISOString()}`);
            
            // Process completed investments and daily accruals
            const result = await ROIService.processCompletedInvestments();
            
            const endTime = new Date();
            const duration = endTime - startTime;
            
            // Log results
            if (result.processed > 0) {
                logger.info(`💰 Successfully processed ${result.processed} investments`);
            }
            
            if (result.failed > 0) {
                logger.warn(`⚠️ ${result.failed} investments failed to process`);
                result.errors.forEach((error, index) => {
                    logger.error(`   Error ${index + 1}: Investment ${error.investment_id || 'unknown'} - ${error.error}`);
                });
            }
            
            if (result.processed === 0 && result.failed === 0) {
                logger.info('✅ No investments found for processing');
            }
            
            logger.info(`⏱️ ROI processing completed in ${duration}ms`);
            
        } catch (error) {
            logger.error('❌ ROI cron job execution failed:', error);
        }
    });
    
    // Log the cron schedule
    logger.info(`⏰ ROI cron job scheduled: ${scheduleDescription}`);
    logger.info(`   Cron pattern: ${cronSchedule}`);
    logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Optional: Run immediate test in development
    if (process.env.NODE_ENV === 'development' && process.env.RUN_IMMEDIATE_ROI === 'true') {
        setTimeout(async () => {
            logger.info('🔍 Development mode: Running initial ROI check in 5 seconds...');
            try {
                const result = await ROIService.processCompletedInvestments();
                logger.info(`🧪 Initial ROI test completed: ${result.processed} processed, ${result.failed} failed`);
            } catch (error) {
                logger.error('❌ Initial ROI test failed:', error);
            }
        }, 5000);
    }
}

// Handle cron job errors
process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection in ROI cron:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception in ROI cron:', error);
});

module.exports = { startROICron };