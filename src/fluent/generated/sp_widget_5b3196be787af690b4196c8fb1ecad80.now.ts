import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['5b3196be787af690b4196c8fb1ecad80'],
    name: 'sw-info-row',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
  'use strict';

  // c.data.label - Row label text
  // c.data.value - Row value text
  // c.data.icon  - Optional material icon name
};`,
    serverScript: `/**
 * sw-info-row - Server Script
 *
 * Reads label, value, and optional icon from widget options.
 *
 * Widget Options:
 *   label - Display label (e.g. 'Policy Number')
 *   value - Display value (e.g. 'POL-2024-001234')
 *   icon  - Optional material icon name (e.g. 'description')
 */
(function () {
  'use strict';

  data.label = options.label || '';
  data.value = options.value || '';
  data.icon = options.icon || '';
})();
`,
    htmlTemplate: `<!-- sw-info-row: Label/value pair display row -->
<div class="sw-info-row" ng-if="c.data.label">
  <i class="material-icons sw-info-row__icon" ng-if="c.data.icon">{{c.data.icon}}</i>
  <span class="sw-info-row__label">{{c.data.label}}</span>
  <span class="sw-info-row__value">{{c.data.value}}</span>
</div>`,
    customCss: `/* =============================================================================&#13;
   sw-info-row - Label/Value Pair Row Styles&#13;
   ============================================================================= */&#13;
&#13;
.sw-info-row {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-sm) 0;&#13;
  border-bottom: 1px solid var(--sw-color-border-light);&#13;
  font-size: var(--sw-font-size-base);&#13;
  line-height: var(--sw-line-height);&#13;
&#13;
  &:last-child {&#13;
    border-bottom: none;&#13;
  }&#13;
}&#13;
&#13;
.sw-info-row__icon {&#13;
  font-size: 18px;&#13;
  color: var(--sw-color-text-tertiary);&#13;
  flex-shrink: 0;&#13;
}&#13;
&#13;
.sw-info-row__label {&#13;
  width: 140px;&#13;
  min-width: 140px;&#13;
  flex-shrink: 0;&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  text-transform: uppercase;&#13;
  letter-spacing: 0.025em;&#13;
}&#13;
&#13;
.sw-info-row__value {&#13;
  flex: 1;&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-primary);&#13;
  word-break: break-word;&#13;
}&#13;`,
    id: 'sw-info-row',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
