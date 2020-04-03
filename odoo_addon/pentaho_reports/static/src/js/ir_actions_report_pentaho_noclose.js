odoo.define('pentaho_report.report', function (require) {
  'use strict';
  
  var ActionManager = require('web.ActionManager');
  var framework = require('web.framework');


  var trigger_download = function (session, response, c, action, options) {
    session.get_file({
        url: '/report/download',
        data: {data: JSON.stringify(response)},
        complete: framework.unblockUI,
        error: c.rpc_error.bind(c),
        success: function () {
            if (action && options && !action.dialog) {
                options.on_close();
            }
        },
    });
};

  ActionManager.include({
    ir_actions_report_xml_pentaho_noclose: function (action, options) {
      var self = this;
      action = _.clone(action);

      var report_urls = make_report_url(action);

      if (action.report_type === 'qweb-html') {
          var client_action_options = _.extend({}, options, {
              report_url: report_urls['qweb-html'],
              report_name: action.report_name,
              report_file: action.report_file,
              data: action.data,
              context: action.context,
              name: action.name,
              display_name: action.display_name,
          });
          return this.do_action('report.client_action', client_action_options);
      } else if (action.report_type === 'qweb-pdf') {
          framework.blockUI();
          // Before doing anything, we check the state of wkhtmltopdf on the server.
          (wkhtmltopdf_state = wkhtmltopdf_state || session.rpc('/report/check_wkhtmltopdf')).then(function (state) {
              // Display a notification to the user according to wkhtmltopdf's state.
              if (WKHTMLTOPDF_MESSAGES[state]) {
                  self.do_notify(_t('Report'), WKHTMLTOPDF_MESSAGES[state], true);
              }

              if (state === 'upgrade' || state === 'ok') {
                  // Trigger the download of the PDF report.
                  var response = [
                      report_urls['qweb-pdf'],
                      action.report_type,
                  ];
                  var c = crash_manager;
                  return trigger_download(self.session, response, c, action, options);
              } else {
                  // Open the report in the client action if generating the PDF is not possible.
                  var client_action_options = _.extend({}, options, {
                      report_url: report_urls['qweb-html'],
                      report_name: action.report_name,
                      report_file: action.report_file,
                      data: action.data,
                      context: action.context,
                      name: action.name,
                      display_name: action.display_name,
                  });
                  framework.unblockUI();
                  return self.do_action('report.client_action', client_action_options);
              }
          });
      } else if (action.report_type === 'controller') {
          framework.blockUI();
          var response = [
              report_urls.controller,
              action.report_type,
          ];
          var c = crash_manager;
          return trigger_download(self.session, response, c, action, options);
      } else {
          return self._super(action, options);
      }
  }
});


});