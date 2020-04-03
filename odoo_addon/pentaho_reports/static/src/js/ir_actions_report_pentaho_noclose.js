odoo.define('pentaho_report.report', function (require) {
  'use strict';
  
  var ActionManager = require('web.ActionManager');
  var framework = require('web.framework');

  ActionManager.include({
    ir_actions_report_xml_pentaho_noclose: function(action, options) {
      var self = this;
      framework.blockUI();
      action = _.clone(action);
      var eval_contexts = ([session.user_context] || []).concat([action.context]);
      action.context = pyeval.eval('contexts',eval_contexts);

      // iOS devices doesn't allow iframe use the way we do it,
      // opening a new window seems the best way to workaround
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          var params = {
              action: JSON.stringify(action),
              token: new Date().getTime()
          };
          var url = self.session.url('/web/report', params);
          framework.unblockUI();
          $('<a href="'+url+'" target="_blank"></a>')[0].click();
          return;
      }
      var c = crash_manager;
      return $.Deferred(function (d) {
          self.session.get_file({
              url: '/web/report',
              data: {action: JSON.stringify(action)},
              complete: framework.unblockUI,
              success: function(){
                  if (!self.dialog) {
                      options.on_close();
                  }
                  /* self.dialog_stop(); */
                  d.resolve();
              },
              error: function () {
                  c.rpc_error.apply(c, arguments);
                  d.reject();
              }
          });
      });
  }
});

});