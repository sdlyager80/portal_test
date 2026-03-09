import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['6aac427e783af690b4196c8fb1ecadd6'],
    name: 'sw-progress-bar',
    clientScript: `api.controller=function() {
  'use strict';

  var c = this;

  // Ensure current_step is a number
  c.data.current_step = parseInt(c.data.current_step, 10) || 0;

  /**
   * Listen for step change broadcasts from other widgets.
   * Expected event data: { step: <number> }
   */
  c.$on('sw.step.changed', function (event, eventData) {
    if (eventData && typeof eventData.step === 'number') {
      var maxStep = (c.data.steps && c.data.steps.length) ? c.data.steps.length - 1 : 0;
      c.data.current_step = Math.max(0, Math.min(eventData.step, maxStep));
    }
  });
};`,
    serverScript: `/**
 * sw-progress-bar - Server Script
 *
 * Reads the steps array and current_step index from widget options.
 *
 * Widget Options:
 *   steps        - JSON array of step objects: [{ "label": "Step Name" }, ...]
 *   current_step - Zero-based index of the current active step (default: 0)
 */
(function () {
  'use strict';

  // Parse steps from options
  var steps = [];

  if (options.steps) {
    if (typeof options.steps === 'string') {
      try {
        steps = JSON.parse(options.steps);
      } catch (e) {
        // If JSON parse fails, treat as comma-separated labels
        var labels = options.steps.split(',');
        for (var i = 0; i < labels.length; i++) {
          steps.push({ label: labels[i].trim() });
        }
      }
    } else if (Array.isArray(options.steps)) {
      steps = options.steps;
    }
  }

  // Fallback default steps if none provided
  if (steps.length === 0) {
    steps = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' }
    ];
  }

  data.steps = steps;
  data.current_step = parseInt(options.current_step, 10) || 0;

  // Clamp to valid range
  if (data.current_step < 0) {
    data.current_step = 0;
  }
  if (data.current_step >= steps.length) {
    data.current_step = steps.length - 1;
  }
})();
`,
    htmlTemplate: `<!-- sw-progress-bar: Multi-step wizard progress indicator -->
<div class="sw-progress-bar sw-animate-fade-in">
  <div class="sw-progress-bar__steps">
    <div class="sw-progress-bar__step"
         ng-repeat="step in c.data.steps track by $index"
         ng-class="{
           'sw-progress-bar__step--active': $index === c.data.current_step,
           'sw-progress-bar__step--completed': $index < c.data.current_step,
           'sw-progress-bar__step--pending': $index > c.data.current_step
         }">

      <!-- Connecting line (not on first step) -->
      <div class="sw-progress-bar__connector"
           ng-if="$index > 0"
           ng-class="{
             'sw-progress-bar__connector--completed': $index <= c.data.current_step
           }">
      </div>

      <!-- Step circle -->
      <div class="sw-progress-bar__circle">
        <i class="material-icons" ng-if="$index < c.data.current_step">check</i>
        <span ng-if="$index >= c.data.current_step">{{$index + 1}}</span>
      </div>

      <!-- Step label -->
      <span class="sw-progress-bar__label">{{step.label}}</span>
    </div>
  </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-progress-bar - Multi-Step Wizard Progress Indicator&#13;
   ============================================================================= */&#13;
&#13;
.sw-progress-bar {&#13;
  width: 100%;&#13;
  padding: var(--sw-spacing-md) 0;&#13;
}&#13;
&#13;
.sw-progress-bar__steps {&#13;
  display: flex;&#13;
  align-items: flex-start;&#13;
  justify-content: space-between;&#13;
  position: relative;&#13;
}&#13;
&#13;
.sw-progress-bar__step {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  align-items: center;&#13;
  flex: 1;&#13;
  position: relative;&#13;
  min-width: 0;&#13;
}&#13;
&#13;
/* Connecting line between steps */&#13;
.sw-progress-bar__connector {&#13;
  position: absolute;&#13;
  top: 16px; /* center of the 32px circle */&#13;
  right: 50%;&#13;
  left: calc(-50% + 16px);&#13;
  height: 2px;&#13;
  background-color: var(--sw-color-border);&#13;
  z-index: 0;&#13;
  transform: translateY(-50%);&#13;
&#13;
  &--completed {&#13;
    background-color: var(--sw-color-success);&#13;
  }&#13;
}&#13;
&#13;
/* Step circle */&#13;
.sw-progress-bar__circle {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  width: 32px;&#13;
  height: 32px;&#13;
  min-width: 32px;&#13;
  border-radius: var(--sw-radius-full);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-bold);&#13;
  position: relative;&#13;
  z-index: 1;&#13;
  transition: all var(--sw-transition-normal);&#13;
&#13;
  /* Default pending state */&#13;
  background-color: var(--sw-color-bg-tertiary);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  border: 2px solid var(--sw-color-border);&#13;
&#13;
  .material-icons {&#13;
    font-size: 18px;&#13;
  }&#13;
}&#13;
&#13;
/* Active step */&#13;
.sw-progress-bar__step--active {&#13;
  .sw-progress-bar__circle {&#13;
    background-color: var(--sw-color-primary);&#13;
    color: var(--sw-color-primary-text);&#13;
    border-color: var(--sw-color-primary);&#13;
    box-shadow: 0 0 0 4px var(--sw-color-primary-light);&#13;
  }&#13;
&#13;
  .sw-progress-bar__label {&#13;
    color: var(--sw-color-primary);&#13;
    font-weight: var(--sw-font-weight-semibold);&#13;
  }&#13;
}&#13;
&#13;
/* Completed step */&#13;
.sw-progress-bar__step--completed {&#13;
  .sw-progress-bar__circle {&#13;
    background-color: var(--sw-color-success);&#13;
    color: var(--sw-color-primary-text);&#13;
    border-color: var(--sw-color-success);&#13;
  }&#13;
&#13;
  .sw-progress-bar__label {&#13;
    color: var(--sw-color-success);&#13;
  }&#13;
}&#13;
&#13;
/* Pending step */&#13;
.sw-progress-bar__step--pending {&#13;
  .sw-progress-bar__circle {&#13;
    background-color: var(--sw-color-bg-tertiary);&#13;
    color: var(--sw-color-text-tertiary);&#13;
    border-color: var(--sw-color-border);&#13;
  }&#13;
&#13;
  .sw-progress-bar__label {&#13;
    color: var(--sw-color-text-tertiary);&#13;
  }&#13;
}&#13;
&#13;
/* Step label */&#13;
.sw-progress-bar__label {&#13;
  margin-top: var(--sw-spacing-sm);&#13;
  font-size: var(--sw-font-size-xs);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-secondary);&#13;
  text-align: center;&#13;
  white-space: nowrap;&#13;
  overflow: hidden;&#13;
  text-overflow: ellipsis;&#13;
  max-width: 100%;&#13;
  padding: 0 var(--sw-spacing-xs);&#13;
}&#13;`,
    id: 'sw-progress-bar',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
