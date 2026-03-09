import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['0b894a72787af690b4196c8fb1ecad02'],
    name: 'sw-section-card',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
};`,
    serverScript: `/**
 * sw-section-card - Server Script
 *
 * Reads the title and icon from widget options.
 *
 * Widget Options:
 *   title - Section header title text
 *   icon  - Material icon name (e.g. 'description', 'settings')
 */
(function () {
  'use strict';

  data.title = options.title || '';
  data.icon = options.icon || '';
})();
`,
    htmlTemplate: `<!-- sw-section-card: Reusable titled panel with content slot -->
<div class="sw-card sw-animate-fade-in">
  <div class="sw-card__header" ng-if="c.data.title">
    <div class="sw-card__header-icon" ng-if="c.data.icon">
      <i class="material-icons">{{c.data.icon}}</i>
    </div>
    <span class="sw-card__header-title">{{c.data.title}}</span>
  </div>
  <div class="sw-card__body" ng-transclude></div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-section-card - Titled Section Panel Styles&#13;
   =============================================================================&#13;
   Uses the core sw-card, sw-card__header, and sw-card__body classes&#13;
   defined in sw-core.css. Only local overrides are added here.&#13;
   ============================================================================= */&#13;
&#13;
/* Ensure the card fills its container width */&#13;
:host {&#13;
  display: block;&#13;
  width: 100%;&#13;
}&#13;
&#13;
/* Allow child content to control its own layout */&#13;
.sw-card__body {&#13;
  > :first-child {&#13;
    margin-top: 0;&#13;
  }&#13;
&#13;
  > :last-child {&#13;
    margin-bottom: 0;&#13;
  }&#13;
}&#13;`,
    id: 'sw-section-card',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
