sharedModule.factory('logger', ['$log', '$sanitize', logger]);

function logger($log, $sanitize) {
    var service = {
        getLogFn: getLogFn,
        log: log,
        logError: logError,
        logSuccess: logSuccess,
        logWarning: logWarning
    };

    return service;

    function getLogFn(moduleId, fnName) {
        fnName = fnName || 'log';
        switch (fnName.toLowerCase()) { // convert aliases
            case 'success':
                fnName = 'logSuccess'; break;
            case 'error':
                fnName = 'logError'; break;
            case 'warn':
                fnName = 'logWarning'; break;
            case 'warning':
                fnName = 'logWarning'; break;
        }

        var logFn = service[fnName] || service.log;
        return function (msg, data, showToast) {
            logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
        };
    }

    //used for toastr messages

    function log(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'info');
    }

    function logWarning(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'warning');
    }

    function logSuccess(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'success');
    }

    function logError(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'error');
    }

    function logIt(message, data, source, showToast, toastType) {
        var safeMessage = $sanitize(message); //the toastr message is sanitized for not allowing script tags, etc.
        var write = (toastType === 'error') ? $log.error : $log.log;
        source = source ? '[' + source + '] ' : '';
        write(source, message, data);
        if (showToast) {
            if (toastType === 'error') {
                toastr.error(safeMessage);
            } else if (toastType === 'warning') {
                toastr.warning(safeMessage);
            } else if (toastType === 'success') {
                toastr.success(safeMessage);
            } else {
                toastr.info(safeMessage);
            }
        }
    }
}