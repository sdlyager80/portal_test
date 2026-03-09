import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['286e8e7a787af690b4196c8fb1ecadc0'],
    name: 'sw-priority-badge',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
  'use strict';

  // c.data.priority       - Raw priority value (e.g. '1', '2', '3', '4')
  // c.data.priority_label - Display label (e.g. 'Urgent', 'High', 'Medium', 'Low')
  // c.data.priority_class - CSS class suffix (e.g. 'urgent', 'high', 'medium', 'low')
};`,
    serverScript: `/**
 * sw-priority-badge - Server Script
 *
 * Reads priority value from widget options and maps it to a display
 * label and CSS class.
 *
 * Widget Options:
 *   priority - Priority value: '1'/'urgent', '2'/'high', '3'/'medium', '4'/'low'
 */
(function () {
  'use strict';

  var priority = (options.priority || '').toString().toLowerCase();

  var priorityMap = {
    '1':        { label: 'Urgent',  cssClass: 'urgent' },
    'urgent':   { label: 'Urgent',  cssClass: 'urgent' },
    'critical': { label: 'Urgent',  cssClass: 'urgent' },
    '2':        { label: 'High',    cssClass: 'high' },
    'high':     { label: 'High',    cssClass: 'high' },
    '3':        { label: 'Medium',  cssClass: 'medium' },
    'medium':   { label: 'Medium',  cssClass: 'medium' },
    '4':        { label: 'Low',     cssClass: 'low' },
    'low':      { label: 'Low',     cssClass: 'low' }
  };

  var mapped = priorityMap[priority] || { label: 'Medium', cssClass: 'medium' };

  data.priority = options.priority || '';
  data.priority_label = mapped.label;
  data.priority_class = mapped.cssClass;
})();
`,
    htmlTemplate: `<!-- sw-priority-badge: Inline priority indicator with flag icon -->
<span class="sw-priority"
      ng-class="'sw-priority--' + c.data.priority_class"
      ng-if="c.data.priority">
  <i class="material-icons">flag</i>
  {{c.data.priority_label}}
</span>
`,
    customCss: `/* =============================================================================&#13;
   sw-priority-badge - Priority Indicator Styles&#13;
   =============================================================================&#13;
   Uses the core .sw-priority classes from sw-core.css:&#13;
     .sw-priority&#13;
     .sw-priority--urgent&#13;
     .sw-priority--high&#13;
     .sw-priority--medium&#13;
     .sw-priority--low&#13;
   No additional styles needed beyond the core classes.&#13;
   ============================================================================= */`,
    id: 'sw-priority-badge',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
