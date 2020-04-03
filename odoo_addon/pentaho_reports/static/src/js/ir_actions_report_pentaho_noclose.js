ir_actions_report_xml_pentaho_noclose = function(instance, local, QWeb){

  instance.web.ActionManager.include({
    ir_actions_report_xml_pentaho_noclose: function(action, options) {
      var self = this;
      instance.web.blockUI();
      action = _.clone(action);
      var eval_contexts = ([instance.session.user_context] || []).concat([action.context]);
      action.context = instance.web.pyeval.eval('contexts',eval_contexts);
      // iOS devices doesn't allow iframe use the way we do it,
      // opening a new window seems the best way to workaround
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        var params = {
          action: JSON.stringify(action),
          token: new Date().getTime()
        };
        var url = self.session.url('/web/report', params);
        instance.web.unblockUI();
        $('<a href="'+url+'" target="_blank"></a>')[0].click();
        return;
      }
      var c = instance.webclient.crashmanager;
      return $.Deferred(function (d) {
        self.session.get_file({
          url: '/web/report',
          data: {action: JSON.stringify(action)},
          complete: instance.web.unblockUI,
          success: function(){
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
}