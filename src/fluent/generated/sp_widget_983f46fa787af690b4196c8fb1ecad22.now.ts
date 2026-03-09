import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['983f46fa787af690b4196c8fb1ecad22'],
    name: 'sw-portal-header',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
};`,
    serverScript: `(function () {
  data.themeSwitcher = $sp.getWidget('sw-theme-switcher');
  data.userInfo = $sp.getWidget('sw-header-user-info');
})();
`,
    htmlTemplate: `<div class="sw-portal-header">
  <div class="sw-portal-header__left">
    <i class="material-icons">dashboard</i>
    <span class="sw-portal-header__title">Smart Workspace</span>
  </div>
  <div class="sw-portal-header__right">
    <sp-widget widget="c.data.themeSwitcher"></sp-widget>
    <sp-widget widget="c.data.userInfo"></sp-widget>
  </div>
</div>
`,
    customCss: `.sw-portal-header {&#13;
  position: fixed;&#13;
  top: 0;&#13;
  left: 0;&#13;
  right: 0;&#13;
  z-index: var(--sw-z-header, 1000);&#13;
&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: space-between;&#13;
&#13;
  /* Fluid height */&#13;
  height: clamp(56px, 6vh, 72px);&#13;
&#13;
  /* Fluid padding */&#13;
  padding: 0 clamp(16px, 2.5vw, 32px);&#13;
&#13;
  background-color: var(--sw-header-bg, #ffffff);&#13;
  border-bottom: 1px solid var(--sw-border-color, #e0e0e0);&#13;
  box-shadow: var(--sw-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));&#13;
}&#13;
&#13;
/* Left section */&#13;
.sw-portal-header__left {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: clamp(8px, 1.5vw, 16px);&#13;
}&#13;
&#13;
/* Icon */&#13;
.sw-portal-header__left .material-icons {&#13;
  font-size: clamp(24px, 2.5vw, 32px);&#13;
  color: var(--sw-color-primary, #1a73e8);&#13;
}&#13;
&#13;
/* Title */&#13;
.sw-portal-header__title {&#13;
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);&#13;
  font-weight: var(--sw-font-weight-semibold, 600);&#13;
  color: var(--sw-text-primary, #202124);&#13;
  letter-spacing: -0.01em;&#13;
  white-space: nowrap;&#13;
}&#13;
&#13;
/* Right section */&#13;
.sw-portal-header__right {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: clamp(12px, 2vw, 24px);&#13;
}&#13;`,
    id: 'sw-portal-header',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
