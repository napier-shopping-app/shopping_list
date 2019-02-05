const INFO_LOG_LEVEL = "info";
const TRACE_LOG_LEVEL = "trace";
const WARN_LOG_LEVEL = "warn";

module.exports = function(logger) {
    this.info = (message) => {
        this.logData({logLevel: INFO_LOG_LEVEL, message});
    }
    
    this.trace = (message) => {
        this.logData({logLevel: TRACE_LOG_LEVEL, message});
    }

    this.warn = (message) => {
        this.logData({logLevel: WARN_LOG_LEVEL, message});
    }

    this.logData = (data) => {
        if (logger) {
            return logger[data.logLevel](data.message);
        }
    
        process.send(data);
    }
}
