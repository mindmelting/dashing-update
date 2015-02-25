var config = {
    dashboardUrl: 'http://localhost:3030',
    authCode: 'AUTH_CODE',
    widgets: [
        {
            widgetId: 'test_widget',
            fields: ['passed', 'failed', 'total']
        }
    ]
};

module.exports = exports = config;
