import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['41c68a7e783af690b4196c8fb1ecad47'],
    name: 'sw-theme-switcher',
    clientScript: `api.controller = function($scope, $rootScope) {
    var c = this;

    // Initialize state from server data
    c.themes = c.data.themes || [];
    c.currentTheme = c.data.currentTheme || 'default';
    c.dropdownOpen = false;

    /**
     * Toggle the dropdown open/closed.
     */
    c.toggleDropdown = function() {
        c.dropdownOpen = !c.dropdownOpen;
    };

    /**
     * Select a theme, apply it to the page, and persist via server.
     */
    c.selectTheme = function(theme) {
        if (!theme || theme.value === c.currentTheme) {
            c.dropdownOpen = false;
            return;
        }

        c.currentTheme = theme.value;

        // Remove all existing sw-theme-* classes from body
        var body = document.body;
        var classList = body.className.split(/\\s+/);
        classList.forEach(function(cls) {
            if (/^sw-theme-/.test(cls)) {
                body.classList.remove(cls);
            }
        });

        // Apply the new theme class
        if (theme.bodyClass) {
            body.classList.add(theme.bodyClass);
        }

        // Persist the selection on the server
        c.server.get({ action: 'save_theme', theme: theme.value }).then(function() {
            // Theme saved successfully
        }).catch(function(err) {
            console.warn('Failed to save theme preference', err);
        });

        // Notify other widgets of the change
        $rootScope.$broadcast('sw.theme.changed', {
            theme: theme.value,
            bodyClass: theme.bodyClass
        });

        // Close the dropdown
        c.dropdownOpen = false;
    };

    /**
     * Close dropdown when clicking outside the widget.
     */
    function onDocumentClick(event) {
        var widgetEl = document.querySelector('.sw-theme-switcher');
        if (widgetEl && !widgetEl.contains(event.target) && c.dropdownOpen) {
            $scope.$apply(function() {
                c.dropdownOpen = false;
            });
        }
    }

    document.addEventListener('click', onDocumentClick);

    // Cleanup listener on scope destroy
    $scope.$on('$destroy', function() {
        document.removeEventListener('click', onDocumentClick);
    });
};
`,
    serverScript: `(function() {
    // Build configurable table config from widget options
    var cfg = new SmartWorkspaceConfig(options);
    var themeUtil = new SmartWorkspaceTheme();
    var userId = gs.getUserID();

    // Handle save action from client
    if (input && input.action === 'save_theme') {
        try {
            themeUtil.setUserTheme(userId, input.theme);
            data.currentTheme = input.theme;
        } catch (e) {
            gs.warn('sw-theme-switcher: Error saving theme - ' + e.message);
            data.currentTheme = 'default';
        }
        return;
    }

    // Initial load: populate available themes and user's current preference
    data.themes = themeUtil.getAvailableThemes();
    try {
        data.currentTheme = themeUtil.getUserTheme(userId);
    } catch (e) {
        gs.warn('sw-theme-switcher: Error loading theme - ' + e.message);
        data.currentTheme = 'default';
    }
})();
`,
    htmlTemplate: `<div class="sw-theme-switcher">
  <button class="sw-theme-switcher__btn"
          ng-click="c.toggleDropdown()"
          title="Switch theme">
    <i class="material-icons sw-theme-switcher__btn-icon">palette</i>
    <span class="sw-theme-switcher__btn-label">Theme</span>
    <i class="material-icons sw-theme-switcher__btn-caret"
       ng-class="{'is-open': c.dropdownOpen}">expand_more</i>
  </button>

  <div class="sw-theme-switcher__dropdown"
       ng-if="c.dropdownOpen">
    <ul class="sw-theme-switcher__list">
      <li class="sw-theme-switcher__option"
          ng-repeat="theme in c.themes track by theme.value"
          ng-class="{'is-active': theme.value === c.currentTheme}"
          ng-click="c.selectTheme(theme)">
        <i class="material-icons sw-theme-switcher__option-icon">{{theme.icon}}</i>
        <span class="sw-theme-switcher__option-label">{{theme.label}}</span>
        <i class="material-icons sw-theme-switcher__option-check"
           ng-if="theme.value === c.currentTheme">check</i>
      </li>
    </ul>
  </div>
</div>
`,
    customCss: `.sw-theme-switcher {&#13;
  position: relative;&#13;
  display: inline-block;&#13;
&#13;
  // Trigger button&#13;
  &__btn {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: 8px;&#13;
    padding: 8px 12px;&#13;
    border: 1px solid var(--sw-border-color, #d0d0d0);&#13;
    border-radius: var(--sw-border-radius, 4px);&#13;
    background-color: var(--sw-btn-bg, #ffffff);&#13;
    color: var(--sw-text-color, #333333);&#13;
    font-size: var(--sw-font-size-sm, 13px);&#13;
    cursor: pointer;&#13;
    transition: background-color 0.2s ease, border-color 0.2s ease;&#13;
&#13;
    &:hover {&#13;
      background-color: var(--sw-btn-hover-bg, #f4f4f4);&#13;
      border-color: var(--sw-border-color-hover, #b0b0b0);&#13;
    }&#13;
&#13;
    &:focus {&#13;
      outline: 2px solid var(--sw-focus-ring, #1a73e8);&#13;
      outline-offset: 2px;&#13;
    }&#13;
&#13;
    &-icon {&#13;
      font-size: 16px;&#13;
      color: var(--sw-icon-color, #555555);&#13;
    }&#13;
&#13;
    &-label {&#13;
      font-weight: 500;&#13;
    }&#13;
&#13;
    &-caret {&#13;
      font-size: 10px;&#13;
      margin-left: 4px;&#13;
      transition: transform 0.2s ease;&#13;
&#13;
      &.is-open {&#13;
        transform: rotate(180deg);&#13;
      }&#13;
    }&#13;
  }&#13;
&#13;
  // Dropdown panel&#13;
  &__dropdown {&#13;
    position: absolute;&#13;
    top: calc(100% + 4px);&#13;
    left: 0;&#13;
    z-index: 1000;&#13;
    min-width: 180px;&#13;
    padding: 4px 0;&#13;
    border: 1px solid var(--sw-border-color, #d0d0d0);&#13;
    border-radius: var(--sw-border-radius, 4px);&#13;
    background-color: var(--sw-dropdown-bg, #ffffff);&#13;
    box-shadow: var(--sw-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.12));&#13;
    animation: sw-theme-dropdown-fade 0.15s ease;&#13;
  }&#13;
&#13;
  // Option list&#13;
  &__list {&#13;
    list-style: none;&#13;
    margin: 0;&#13;
    padding: 0;&#13;
  }&#13;
&#13;
  // Individual option&#13;
  &__option {&#13;
    display: flex;&#13;
    align-items: center;&#13;
    gap: 10px;&#13;
    padding: 10px 14px;&#13;
    cursor: pointer;&#13;
    color: var(--sw-text-color, #333333);&#13;
    font-size: var(--sw-font-size-sm, 13px);&#13;
    transition: background-color 0.15s ease;&#13;
&#13;
    &:hover {&#13;
      background-color: var(--sw-option-hover-bg, #f0f0f0);&#13;
    }&#13;
&#13;
    &.is-active {&#13;
      color: var(--sw-primary-color, #1a73e8);&#13;
      font-weight: 600;&#13;
    }&#13;
&#13;
    &-icon {&#13;
      width: 20px;&#13;
      text-align: center;&#13;
      font-size: 14px;&#13;
    }&#13;
&#13;
    &-label {&#13;
      flex: 1;&#13;
    }&#13;
&#13;
    &-check {&#13;
      font-size: 12px;&#13;
      color: var(--sw-primary-color, #1a73e8);&#13;
    }&#13;
  }&#13;
}&#13;
&#13;
@keyframes sw-theme-dropdown-fade {&#13;
  from {&#13;
    opacity: 0;&#13;
    transform: translateY(-4px);&#13;
  }&#13;
  to {&#13;
    opacity: 1;&#13;
    transform: translateY(0);&#13;
  }&#13;
}&#13;`,
    id: 'sw-theme-switcher',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
