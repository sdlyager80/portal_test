import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['c5b702fe783af690b4196c8fb1ecad8a'],
    name: 'sw-sidenav',
    clientScript: `api.controller = function ($scope, $location) {
  var c = this;

  function getActivePage() {
    return $location.search().id || 'sw_home';
  }

  function getActiveParams() {
    var search = $location.search();
    var parts = [];
    Object.keys(search).forEach(function (key) {
      if (key !== 'id') {
        parts.push(key + '=' + search[key]);
      }
    });
    return parts.join('&');
  }

  c.activePage = getActivePage();
  c.activeParams = getActiveParams();

  c.navigate = function (item) {
    var params = { id: item.page };

    if (item.params) {
      item.params.split('&').forEach(function (pair) {
        var kv = pair.split('=');
        if (kv.length === 2) {
          params[kv[0]] = kv[1];
        }
      });
    }

    $location.search(params);
  };

  $scope.$on('$locationChangeSuccess', function () {
    c.activePage = getActivePage();
    c.activeParams = getActiveParams();
  });
};
`,
    serverScript: `(function () {
  data.menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', page: 'sw_home' },
    { id: 'work_queue', label: 'My Work Queue', icon: 'assignment', page: 'sw_home', params: 'tab=my_work' },
    { id: 'new_request', label: 'New Request', icon: 'add_circle', page: 'sw_new_request' },
    { id: 'search', label: 'Search Policies', icon: 'search', page: 'sw_search_policies' },
    { id: 'reports', label: 'Reports', icon: 'assessment', page: 'sw_reports' }
  ];
})();
`,
    htmlTemplate: `<div class="sw-portal-layout__sidenav">
  <nav class="sw-sidenav">
    <ul class="sw-sidenav__list">
      <li class="sw-sidenav__item"
          ng-repeat="item in c.data.menuItems"
          ng-class="{ 'sw-sidenav__item--active': c.activePage === item.page && (!item.params || c.activeParams === item.params) }"
          ng-click="c.navigate(item)"
          role="menuitem"
          tabindex="0">
        <span class="sw-sidenav__indicator"></span>
        <i class="material-icons sw-sidenav__icon">{{item.icon}}</i>
        <span class="sw-sidenav__label">{{item.label}}</span>
      </li>
    </ul>
  </nav>
</div>
`,
    customCss: `.sw-sidenav {&#13;
  padding: var(--sw-spacing-sm, 8px) 0;&#13;
&#13;
  &__list {&#13;
    list-style: none;&#13;
    margin: 0;&#13;
    padding: 0;&#13;
  }&#13;
&#13;
  &__item {&#13;
    position: relative;&#13;
    display: flex;&#13;
    align-items: center;&#13;
    height: 48px;&#13;
    padding: 0 var(--sw-spacing-md, 16px);&#13;
    cursor: pointer;&#13;
    color: var(--sw-text-secondary, #5f6368);&#13;
    transition: background-color 0.15s ease, color 0.15s ease;&#13;
    user-select: none;&#13;
&#13;
    &:hover {&#13;
      background-color: var(--sw-hover-bg, rgba(0, 0, 0, 0.04));&#13;
    }&#13;
&#13;
    &--active {&#13;
      color: var(--sw-color-primary, #1a73e8);&#13;
      background-color: var(--sw-active-bg, rgba(26, 115, 232, 0.08));&#13;
&#13;
      .sw-sidenav__indicator {&#13;
        opacity: 1;&#13;
      }&#13;
&#13;
      .sw-sidenav__icon {&#13;
        color: var(--sw-color-primary, #1a73e8);&#13;
      }&#13;
&#13;
      .sw-sidenav__label {&#13;
        font-weight: var(--sw-font-weight-semibold, 600);&#13;
        color: var(--sw-color-primary, #1a73e8);&#13;
      }&#13;
    }&#13;
  }&#13;
&#13;
  &__indicator {&#13;
    position: absolute;&#13;
    left: 0;&#13;
    top: 8px;&#13;
    bottom: 8px;&#13;
    width: 3px;&#13;
    border-radius: 0 3px 3px 0;&#13;
    background-color: var(--sw-color-primary, #1a73e8);&#13;
    opacity: 0;&#13;
    transition: opacity 0.15s ease;&#13;
  }&#13;
&#13;
  &__icon {&#13;
    font-size: 20px;&#13;
    margin-right: var(--sw-spacing-sm, 8px);&#13;
    color: var(--sw-text-secondary, #5f6368);&#13;
    transition: color 0.15s ease;&#13;
  }&#13;
&#13;
  &__label {&#13;
    font-size: var(--sw-font-size-sm, 14px);&#13;
    font-weight: var(--sw-font-weight-regular, 400);&#13;
    color: var(--sw-text-secondary, #5f6368);&#13;
    transition: color 0.15s ease;&#13;
    white-space: nowrap;&#13;
    overflow: hidden;&#13;
    text-overflow: ellipsis;&#13;
  }&#13;
}&#13;`,
    id: 'sw-sidenav',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
