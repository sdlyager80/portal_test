import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['1772963278baf690b4196c8fb1ecadc0'],
    name: 'sw-header-user-info',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
  'use strict';

  // c.data.full_name - User's full display name
  // c.data.initials  - Two-letter initials (e.g. 'JD')
  // c.data.role      - User's role or title
  // c.data.email     - User's email address
};`,
    serverScript: `/**
 * sw-header-user-info - Server Script
 *
 * Retrieves the current user's name, role/title, email, and computes
 * initials from the first and last name.
 */
(function () {
  'use strict';

  var user = gs.getUser();
  var fullName = gs.getUserDisplayName() || 'User';
  var email = user.getEmail() || '';

  // Get role or title
  var role = '';
  try {
    // Try to get the user's title from sys_user
    var userGr = new GlideRecord('sys_user');
    if (userGr.get(user.getID())) {
      role = userGr.getDisplayValue('title') || '';
      if (!role) {
        // Fall back to first user role
        role = userGr.getDisplayValue('u_role') || '';
      }
    }
  } catch (e) {
    role = '';
  }

  // If no title found, try to derive from roles
  if (!role) {
    var roles = user.getRoles();
    if (roles && roles.toString()) {
      var roleList = roles.toString().split(',');
      if (roleList.length > 0) {
        // Use the first role, formatted nicely
        role = roleList[0].replace(/_/g, ' ');
        role = role.charAt(0).toUpperCase() + role.slice(1);
      }
    }
  }

  // Compute initials from full name
  var initials = _computeInitials(fullName);

  data.full_name = fullName;
  data.initials = initials;
  data.role = role || 'User';
  data.email = email;

  /**
   * Compute two-letter initials from a full name.
   * @param {string} name - Full name string
   * @returns {string} Two-letter initials (uppercase)
   */
  function _computeInitials(name) {
    if (!name) return '??';

    var parts = name.trim().split(/\\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    var first = parts[0].charAt(0) || '';
    var last = parts[parts.length - 1].charAt(0) || '';
    return (first + last).toUpperCase();
  }

})();
`,
    htmlTemplate: `<!-- sw-header-user-info: User avatar, name, and role for portal header -->
<div class="sw-header-user-info">
  <div class="sw-avatar sw-header-user-info__avatar"
       title="{{c.data.full_name}}">
    {{c.data.initials}}
  </div>
  <div class="sw-header-user-info__text">
    <div class="sw-header-user-info__name">{{c.data.full_name}}</div>
    <div class="sw-header-user-info__role">{{c.data.role}}</div>
  </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-header-user-info - Header User Info Styles&#13;
   ============================================================================= */&#13;
&#13;
.sw-header-user-info {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-header-user-info__avatar {&#13;
  /* Extends .sw-avatar from core */&#13;
  flex-shrink: 0;&#13;
}&#13;
&#13;
.sw-header-user-info__text {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  min-width: 0;&#13;
}&#13;
&#13;
.sw-header-user-info__name {&#13;
  font-size: var(--sw-font-size-base);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  color: var(--sw-color-text-primary);&#13;
  white-space: nowrap;&#13;
  overflow: hidden;&#13;
  text-overflow: ellipsis;&#13;
  line-height: 1.3;&#13;
}&#13;
&#13;
.sw-header-user-info__role {&#13;
  font-size: var(--sw-font-size-xs);&#13;
  font-weight: var(--sw-font-weight-regular);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  white-space: nowrap;&#13;
  overflow: hidden;&#13;
  text-overflow: ellipsis;&#13;
  line-height: 1.3;&#13;
}&#13;`,
    id: 'sw-header-user-info',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
