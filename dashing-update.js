var config = require('./config'),
    colors = require('colors'),
    readline = require('readline'),
    request = require('request'),
    Promise = require('bluebird'),
    _ = require('lodash');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getWidgetIds() {
    return _.pluck(config.widgets, 'widgetId');
}

function getWidgetFields(widgetId) {
    return _.result(_.find(config.widgets, 'widgetId', widgetId), 'fields');
}

function getUserFields(fields) {
    return Promise.map(fields, function(field) {
        return new Promise(function(resolve, reject) {
            rl.question('Add field - ' + field.bold + ' :', function(answer) {
                resolve({
                    field: field,
                    answer: answer
                });
            });
        });
    }, {
        concurrency: 1
    });
}

function onUserEntry(input) {
    var widgetIds = getWidgetIds(),
        widgetId;

    if (parseInt(input, 10) > widgetIds.length) {
        conosle.log('You must enter an integer that represents the widget'.bold.red);
        process.exit(1);
    } else {
        widgetId = widgetIds[parseInt(input, 10) - 1];
        getUserFields(getWidgetFields(widgetId)).then(function(fields) {
            updateWidget(widgetId, fields);
        });
    }
}

function outputIds() {
    console.log('Choose a widget to update:'.bold);
    _.each(getWidgetIds(), function(widgetId, index) {
        console.log('(' + (index + 1) + ') ' + widgetId);
    });
    rl.on('line', onUserEntry);
}

function updateWidget(widgetId, userFields) {
    var fieldObj = {};
    
    _.each(userFields, function(userField) {
        fieldObj[userField.field] = userField.answer;
    });

    fieldObj.auth_token = config.authCode;

    request.post(
        config.dashboardUrl + '/widgets/' + widgetId,
        { form: JSON.stringify(fieldObj) },
        function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log(response.statusCode);
                console.log(error);
                process.exit(1);
            } else {
                process.exit(0);
            }
        }
    );
}

outputIds();
