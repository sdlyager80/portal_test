import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['f2609e3e787af690b4196c8fb1ecad97'],
    name: 'sw-metric-card',
    clientScript: `api.controller=function() {
  /* widget controller */
  var c = this;
  'use strict';

  // c.data is populated by the server script:
  //   c.data.icon        - Material icon name
  //   c.data.label       - Metric label text
  //   c.data.value       - Computed aggregate value
  //   c.data.color       - Icon circle foreground color
  //   c.data.color_light - Icon circle background color
  //   c.data.subtext     - Optional descriptive subtext
  //   c.data.trend       - Optional trend direction: 'up', 'down', or 'flat'
};`,
    serverScript: `/**
 * sw-metric-card - Server Script
 *
 * Reads widget options to determine icon, label, table, encoded_query,
 * aggregate_type, color, and subtext. Uses GlideAggregate to compute
 * the metric value from the specified table/query.
 *
 * The table option can reference shared data source table names
 * (e.g. set table to the value of table_service_request option)
 * or any arbitrary ServiceNow table name.
 *
 * Widget Options:
 *   icon           - Material icon name (e.g. 'assignment')
 *   label          - Display label for the metric
 *   table          - ServiceNow table to aggregate (resolved via config if matches a known key)
 *   encoded_query  - Encoded query string for filtering records
 *   aggregate_type - GlideAggregate type: 'COUNT', 'SUM', 'AVG'
 *   aggregate_field- Field to aggregate on (required for SUM/AVG)
 *   color          - CSS color value or variable for the icon accent
 *   default_value  - Fallback value if no table is specified
 *   + All shared_data_source_options from widget-options-schema.json
 */
(function () {
  'use strict';

  // Build configurable table config from widget options
  var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
  var tables = cfg.getTables();

  // Read widget options
  var icon = options.icon || 'info';
  var label = options.label || 'Metric';
  var rawTable = options.table || '';
  var encodedQuery = options.encoded_query || '';
  var aggregateType = (options.aggregate_type || 'COUNT').toUpperCase();
  var aggregateField = options.aggregate_field || '';
  var color = options.color || 'var(--sw-color-primary)';
  var defaultValue = options.default_value || '0';

  // Resolve table name: check if it's a config key (e.g. 'service_request' -> resolved table)
  // otherwise use it as a literal table name
  var table = '';
  if (rawTable) {
    if (tables[rawTable]) {
      table = tables[rawTable];
    } else {
      table = rawTable;
    }
  }

  var value = defaultValue;

  // Compute value via GlideAggregate if a table is specified
  if (table) {
    try {
      var ga = new GlideAggregate(table);

      if (encodedQuery) {
        ga.addEncodedQuery(encodedQuery);
      }

      if (aggregateType === 'COUNT') {
        ga.addAggregate('COUNT');
      } else if (aggregateField) {
        ga.addAggregate(aggregateType, aggregateField);
      } else {
        // Default to COUNT if no field provided for non-COUNT aggregates
        ga.addAggregate('COUNT');
      }

      ga.query();

      if (ga.next()) {
        if (aggregateType === 'COUNT') {
          value = ga.getAggregate('COUNT') || '0';
        } else if (aggregateField) {
          value = ga.getAggregate(aggregateType, aggregateField) || '0';
        }
      }
    } catch (e) {
      // If GlideAggregate fails, fall back to default
      value = defaultValue;
    }
  }

  // Compute a lighter variant of the color for the icon background
  var colorLight = _hexToLightBg(color);

  // Populate data for the client
  data.icon = icon;
  data.label = label;
  data.value = value;
  data.color = color;
  data.color_light = colorLight;

  /**
   * Converts a hex color to a light background variant (10% opacity equivalent).
   * If the color is a CSS variable, returns a semi-transparent fallback.
   * @param {string} hex - Hex color string or CSS variable
   * @returns {string} RGBA color string or CSS variable
   */
  function _hexToLightBg(hex) {
    if (!hex || hex.indexOf('var(') === 0) {
      // CSS variable - return a light variant variable or transparent fallback
      return hex ? hex.replace(')', '-light)') : 'rgba(0,149,255,0.1)';
    }
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',0.1)';
  }

})();
`,
    htmlTemplate: `<!-- sw-metric-card: Single KPI metric card -->
<div class="sw-metric-card sw-animate-fade-in">
  <div class="sw-metric-card__icon-wrapper"
       ng-style="{'background-color': c.data.color_light, 'color': c.data.color}">
    <i class="material-icons">{{c.data.icon}}</i>
  </div>

  <div class="sw-metric-card__content">
    <div class="sw-metric-card__value">{{c.data.value}}</div>
    <div class="sw-metric-card__label">{{c.data.label}}</div>
    <div class="sw-metric-card__subtext" ng-if="c.data.subtext">
      <span class="sw-metric-card__trend" ng-if="c.data.trend"
            ng-class="{
              'sw-metric-card__trend--up': c.data.trend === 'up',
              'sw-metric-card__trend--down': c.data.trend === 'down'
            }">
        <i class="material-icons">
          {{c.data.trend === 'up' ? 'trending_up' : c.data.trend === 'down' ? 'trending_down' : 'trending_flat'}}
        </i>
      </span>
      {{c.data.subtext}}
    </div>
  </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-metric-card - KPI Metric Card Styles&#13;
   ============================================================================= */&#13;
&#13;
.sw-metric-card {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-md);&#13;
  padding: var(--sw-spacing-lg);&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-radius: var(--sw-radius-lg);&#13;
  box-shadow: var(--sw-shadow-sm);&#13;
  transition: box-shadow var(--sw-transition-normal);&#13;
&#13;
  &:hover {&#13;
    box-shadow: var(--sw-shadow-md);&#13;
  }&#13;
}&#13;
&#13;
.sw-metric-card__icon-wrapper {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  width: 48px;&#13;
  height: 48px;&#13;
  min-width: 48px;&#13;
  border-radius: var(--sw-radius-full);&#13;
  font-size: 0;&#13;
&#13;
  .material-icons {&#13;
    font-size: 24px;&#13;
  }&#13;
}&#13;
&#13;
.sw-metric-card__content {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  min-width: 0;&#13;
}&#13;
&#13;
.sw-metric-card__value {&#13;
  font-size: var(--sw-font-size-2xl);&#13;
  font-weight: var(--sw-font-weight-bold);&#13;
  color: var(--sw-color-text-primary);&#13;
  line-height: 1.2;&#13;
}&#13;
&#13;
.sw-metric-card__label {&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  text-transform: uppercase;&#13;
  letter-spacing: 0.03em;&#13;
  margin-top: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-metric-card__subtext {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
  font-size: var(--sw-font-size-xs);&#13;
  color: var(--sw-color-text-secondary);&#13;
  margin-top: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-metric-card__trend {&#13;
  display: inline-flex;&#13;
  align-items: center;&#13;
&#13;
  .material-icons {&#13;
    font-size: 16px;&#13;
  }&#13;
&#13;
  &--up {&#13;
    color: var(--sw-color-success);&#13;
  }&#13;
&#13;
  &--down {&#13;
    color: var(--sw-color-error);&#13;
  }&#13;
}&#13;`,
    id: 'sw-metric-card',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
