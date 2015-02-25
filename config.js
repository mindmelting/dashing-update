var config = {
    dashboardUrl: 'http://localhost:3030',
    widgetId: 'test_bpm',
    authCode: 'springcobdash',
    widgets: [
        {
            widgetId: 'test_bpm',
            fields: ['passed', 'failed', 'total']
        }
    ]
};

module.exports = exports = config;
