import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['b5984632787af690b4196c8fb1ecad06'],
    name: 'sw-service-request-wizard',
    clientScript: `api.controller = function($scope, $timeout) {
    var c = this;

    c.currentStep = 0;
    c.showSuccess = false;
    c.submitting = false;
    c.createdNumber = '';
    c.uploadedFiles = [];

    c.steps = ['Request Type', 'Policy Info', 'Details', 'Review'];

    c.priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    c.formData = {
        request_type: '',
        priority: 'medium',
        policy_number: '',
        customer_name: '',
        phone: '',
        email: '',
        policy_type: '',
        policy_value: '',
        notes: '',
        // Beneficiary change
        beneficiary_name: '',
        beneficiary_relationship: '',
        beneficiary_allocation: null,
        // Address change
        new_street: '',
        new_city: '',
        new_state: '',
        new_zip: '',
        // Name change
        current_name: '',
        new_name: '',
        name_change_reason: '',
        // Generic
        detail_description: ''
    };

    c.sections = { type: true, policy: true, details: true };

    c.getSelectedTypeName = function() {
        var types = c.data.requestTypes || [];
        for (var i = 0; i < types.length; i++) {
            if (types[i].sys_id === c.formData.request_type) {
                return types[i].name;
            }
        }
        return '';
    };

    c.getSelectedTypeLabel = function() {
        var types = c.data.requestTypes || [];
        for (var i = 0; i < types.length; i++) {
            if (types[i].sys_id === c.formData.request_type) {
                return types[i].label;
            }
        }
        return '';
    };

    c.getPriorityLabel = function() {
        for (var i = 0; i < c.priorities.length; i++) {
            if (c.priorities[i].value === c.formData.priority) {
                return c.priorities[i].label;
            }
        }
        return '';
    };

    c.getRequestTypeHelp = function() {
        var helpText = {
            'beneficiary_change': 'You will need the new beneficiary\\'s full name, relationship, and desired allocation percentage.',
            'address_change': 'You will need the complete new mailing address including street, city, state, and zip code.',
            'name_change': 'You will need legal documentation supporting the name change (marriage certificate, court order, etc.).',
            'payment_method': 'You will need the new payment method details (bank account, credit card, etc.).',
            'coverage_modification': 'Specify the desired coverage amount. Underwriting review may be required.',
            'policy_cancellation': 'Please note that cancellation may result in loss of coverage and potential surrender charges.',
            'reinstatement': 'The policy must be within the reinstatement period. Back premiums may be required.',
            'duplicate_documents': 'Specify which documents you need duplicates of.',
            'general_inquiry': 'Describe your inquiry in detail.'
        };
        return helpText[c.getSelectedTypeName()] || 'Please provide the requested information.';
    };

    c.isGenericType = function() {
        var specificTypes = ['beneficiary_change', 'address_change', 'name_change'];
        return specificTypes.indexOf(c.getSelectedTypeName()) === -1;
    };

    c.isStepValid = function() {
        switch (c.currentStep) {
            case 0:
                return c.formData.request_type && c.formData.priority;
            case 1:
                return c.formData.policy_number && c.formData.customer_name;
            case 2:
                var typeName = c.getSelectedTypeName();
                if (typeName === 'beneficiary_change') {
                    return c.formData.beneficiary_name && c.formData.beneficiary_relationship && c.formData.beneficiary_allocation;
                } else if (typeName === 'address_change') {
                    return c.formData.new_street && c.formData.new_city && c.formData.new_state && c.formData.new_zip;
                } else if (typeName === 'name_change') {
                    return c.formData.current_name && c.formData.new_name && c.formData.name_change_reason;
                } else {
                    return c.formData.detail_description || c.formData.notes;
                }
            case 3:
                return true;
            default:
                return false;
        }
    };

    c.nextStep = function() {
        if (c.isStepValid() && c.currentStep < 3) {
            c.currentStep++;
        }
    };

    c.prevStep = function() {
        if (c.currentStep > 0) {
            c.currentStep--;
        }
    };

    c.toggleSection = function(section) {
        c.sections[section] = !c.sections[section];
    };

    c.getReviewDetails = function() {
        var details = [];
        var typeName = c.getSelectedTypeName();

        if (typeName === 'beneficiary_change') {
            details.push({ label: 'Beneficiary Name', value: c.formData.beneficiary_name });
            details.push({ label: 'Relationship', value: c.formData.beneficiary_relationship });
            details.push({ label: 'Allocation', value: c.formData.beneficiary_allocation + '%' });
        } else if (typeName === 'address_change') {
            details.push({ label: 'New Address', value: c.formData.new_street + ', ' + c.formData.new_city + ', ' + c.formData.new_state + ' ' + c.formData.new_zip });
        } else if (typeName === 'name_change') {
            details.push({ label: 'Current Name', value: c.formData.current_name });
            details.push({ label: 'New Name', value: c.formData.new_name });
            details.push({ label: 'Reason', value: c.formData.name_change_reason });
        } else {
            details.push({ label: 'Description', value: c.formData.detail_description });
        }

        if (c.formData.notes) {
            details.push({ label: 'Additional Notes', value: c.formData.notes });
        }

        if (c.uploadedFiles.length > 0) {
            details.push({ label: 'Attachments', value: c.uploadedFiles.length + ' file(s)' });
        }

        return details;
    };

    c.handleFiles = function(files) {
        for (var i = 0; i < files.length; i++) {
            c.uploadedFiles.push({ name: files[i].name, size: files[i].size, file: files[i] });
        }
        $scope.$apply();
    };

    c.removeFile = function(index) {
        c.uploadedFiles.splice(index, 1);
    };

    c.submitRequest = function() {
        c.submitting = true;
        c.server.get({
            action: 'submit',
            formData: c.formData
        }).then(function(response) {
            c.submitting = false;
            if (response.data.success) {
                c.showSuccess = true;
                c.createdNumber = response.data.number;
                $timeout(function() {
                    window.location.href = '?id=sw_home';
                }, 3000);
            }
        }).catch(function(err) {
            c.submitting = false;
            console.warn('Failed to submit request', err);
        });
    };

    c.goToDashboard = function() {
        window.location.href = '?id=sw_home';
    };
};
`,
    serverScript: `(function() {
    // Build configurable table config from widget options
    var cfg = new x_dxcis_smart_st_0.SmartWorkspaceConfig(options);
    var util = new x_dxcis_smart_st_0.SmartWorkspaceUtil(cfg.getTables());

    // Default empty
    data.requestTypes = [];

    try {
        // Load request types for dropdown
        data.requestTypes = util.getRequestTypes();
    } catch (e) {
        gs.warn('sw-service-request-wizard: Error loading request types - ' + e.message);
    }

    // Handle submit action
    if (input && input.action === 'submit') {
        try {
            var formData = input.formData;

            // Build description from form data
            var description = formData.detail_description || formData.notes || '';
            if (!description) {
                // Auto-generate description based on type
                var typeName = '';
                var types = util.getRequestTypes();
                for (var i = 0; i < types.length; i++) {
                    if (types[i].sys_id === formData.request_type) {
                        typeName = types[i].label;
                        break;
                    }
                }
                description = typeName + ' request for policy ' + formData.policy_number;
            }

            // Look up policy by number using the configurable policy table
            var policyId = util.getPolicySysIdByNumber(formData.policy_number);

            var requestData = {
                policy: policyId,
                customer_name: formData.customer_name,
                request_type: formData.request_type,
                priority: formData.priority,
                description: description,
                policy_type: formData.policy_type,
                policy_value: formData.policy_value
            };

            var sysId = util.createRequest(requestData);

            if (sysId) {
                // Get the created record's number using the utility
                var number = util.getRequestNumber(sysId);
                if (number) {
                    data.success = true;
                    data.number = number;
                    data.sys_id = sysId;
                }
            } else {
                data.success = false;
                data.error = 'Failed to create service request';
            }
        } catch (e) {
            gs.warn('sw-service-request-wizard: Error during submit - ' + e.message);
            data.success = false;
            data.error = 'An error occurred while creating the request';
        }
    }
})();
`,
    htmlTemplate: `<div class="sw-wizard sw-animate-fade-in">

    <!-- Success Screen -->
    <div class="sw-wizard__success" ng-if="c.showSuccess">
        <div class="sw-wizard__success-icon">
            <i class="material-icons">check_circle</i>
        </div>
        <h2>Request Submitted Successfully!</h2>
        <p>Your service request <strong>{{c.createdNumber}}</strong> has been created.</p>
        <p class="sw-text-muted">You will be redirected to the dashboard shortly.</p>
        <button class="sw-btn sw-btn--primary" ng-click="c.goToDashboard()">Go to Dashboard</button>
    </div>

    <!-- Wizard Form -->
    <div ng-if="!c.showSuccess">

        <!-- Step Progress Bar -->
        <div class="sw-wizard__progress">
            <div class="sw-wizard__step" ng-repeat="step in c.steps track by $index"
                 ng-class="{'sw-wizard__step--active': $index === c.currentStep, 'sw-wizard__step--completed': $index < c.currentStep}">
                <div class="sw-wizard__step-circle">
                    <i class="material-icons" ng-if="$index < c.currentStep">check</i>
                    <span ng-if="$index >= c.currentStep">{{$index + 1}}</span>
                </div>
                <span class="sw-wizard__step-label">{{step}}</span>
                <div class="sw-wizard__step-line" ng-if="$index < c.steps.length - 1"></div>
            </div>
        </div>

        <!-- Step 1: Request Type & Priority -->
        <div class="sw-wizard__content sw-card" ng-if="c.currentStep === 0">
            <div class="sw-card__body">
                <h3 class="sw-mb-lg">Select Request Type & Priority</h3>

                <div class="sw-form-group sw-mb-lg">
                    <label class="sw-label sw-label--required">Request Type</label>
                    <select class="sw-select" ng-model="c.formData.request_type"
                            ng-options="type.sys_id as type.label for type in c.data.requestTypes">
                        <option value="">-- Select Request Type --</option>
                    </select>
                </div>

                <div class="sw-form-group sw-mb-lg">
                    <label class="sw-label sw-label--required">Priority</label>
                    <div class="sw-radio-group">
                        <label class="sw-radio" ng-repeat="p in c.priorities">
                            <input type="radio" name="priority" ng-model="c.formData.priority" ng-value="p.value">
                            <span class="sw-radio__label" ng-class="'sw-priority--' + p.value">
                                <i class="material-icons">flag</i> {{p.label}}
                            </span>
                        </label>
                    </div>
                </div>

                <div class="sw-form-group" ng-if="c.formData.request_type">
                    <div class="sw-alert sw-alert--info">
                        <i class="material-icons">info</i>
                        <span>{{c.getRequestTypeHelp()}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Policy & Customer Information -->
        <div class="sw-wizard__content sw-card" ng-if="c.currentStep === 1">
            <div class="sw-card__body">
                <h3 class="sw-mb-lg">Policy & Customer Information</h3>

                <div class="sw-form-row">
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label sw-label--required">Policy Number</label>
                        <input type="text" class="sw-input" ng-model="c.formData.policy_number"
                               placeholder="e.g., POL-789456123">
                    </div>
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label sw-label--required">Customer Name</label>
                        <input type="text" class="sw-input" ng-model="c.formData.customer_name"
                               placeholder="Full name">
                    </div>
                </div>

                <div class="sw-form-row">
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label">Phone Number</label>
                        <input type="tel" class="sw-input" ng-model="c.formData.phone"
                               placeholder="(555) 123-4567">
                    </div>
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label">Email Address</label>
                        <input type="email" class="sw-input" ng-model="c.formData.email"
                               placeholder="customer@email.com">
                    </div>
                </div>

                <div class="sw-form-row">
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label">Policy Type</label>
                        <input type="text" class="sw-input" ng-model="c.formData.policy_type"
                               placeholder="e.g., Term Life Insurance">
                    </div>
                    <div class="sw-form-group sw-flex--1">
                        <label class="sw-label">Policy Value</label>
                        <input type="text" class="sw-input" ng-model="c.formData.policy_value"
                               placeholder="e.g., $500,000">
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 3: Request Details (context-specific) -->
        <div class="sw-wizard__content sw-card" ng-if="c.currentStep === 2">
            <div class="sw-card__body">
                <h3 class="sw-mb-lg">Request Details</h3>

                <!-- Beneficiary Change Fields -->
                <div ng-if="c.getSelectedTypeName() === 'beneficiary_change'">
                    <div class="sw-form-group sw-mb-lg">
                        <label class="sw-label sw-label--required">New Beneficiary Name</label>
                        <input type="text" class="sw-input" ng-model="c.formData.beneficiary_name">
                    </div>
                    <div class="sw-form-row">
                        <div class="sw-form-group sw-flex--1">
                            <label class="sw-label sw-label--required">Relationship</label>
                            <select class="sw-select" ng-model="c.formData.beneficiary_relationship">
                                <option value="">-- Select --</option>
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                                <option value="sibling">Sibling</option>
                                <option value="trust">Trust</option>
                                <option value="estate">Estate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="sw-form-group sw-flex--1">
                            <label class="sw-label sw-label--required">Allocation (%)</label>
                            <input type="number" class="sw-input" ng-model="c.formData.beneficiary_allocation"
                                   min="1" max="100">
                        </div>
                    </div>
                </div>

                <!-- Address Change Fields -->
                <div ng-if="c.getSelectedTypeName() === 'address_change'">
                    <div class="sw-form-group sw-mb-md">
                        <label class="sw-label sw-label--required">New Street Address</label>
                        <input type="text" class="sw-input" ng-model="c.formData.new_street">
                    </div>
                    <div class="sw-form-row">
                        <div class="sw-form-group sw-flex--1">
                            <label class="sw-label sw-label--required">City</label>
                            <input type="text" class="sw-input" ng-model="c.formData.new_city">
                        </div>
                        <div class="sw-form-group" style="width: 120px;">
                            <label class="sw-label sw-label--required">State</label>
                            <input type="text" class="sw-input" ng-model="c.formData.new_state"
                                   maxlength="2" placeholder="TX">
                        </div>
                        <div class="sw-form-group" style="width: 140px;">
                            <label class="sw-label sw-label--required">Zip Code</label>
                            <input type="text" class="sw-input" ng-model="c.formData.new_zip"
                                   maxlength="10">
                        </div>
                    </div>
                </div>

                <!-- Name Change Fields -->
                <div ng-if="c.getSelectedTypeName() === 'name_change'">
                    <div class="sw-form-row">
                        <div class="sw-form-group sw-flex--1">
                            <label class="sw-label sw-label--required">Current Legal Name</label>
                            <input type="text" class="sw-input" ng-model="c.formData.current_name">
                        </div>
                        <div class="sw-form-group sw-flex--1">
                            <label class="sw-label sw-label--required">New Legal Name</label>
                            <input type="text" class="sw-input" ng-model="c.formData.new_name">
                        </div>
                    </div>
                    <div class="sw-form-group sw-mt-md">
                        <label class="sw-label sw-label--required">Reason for Name Change</label>
                        <select class="sw-select" ng-model="c.formData.name_change_reason">
                            <option value="">-- Select --</option>
                            <option value="marriage">Marriage</option>
                            <option value="divorce">Divorce</option>
                            <option value="legal_change">Legal Name Change</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <!-- Generic Detail Fields (for types without specific fields) -->
                <div ng-if="c.isGenericType()">
                    <div class="sw-form-group">
                        <label class="sw-label sw-label--required">Description</label>
                        <textarea class="sw-textarea" ng-model="c.formData.detail_description"
                                  placeholder="Provide details about your request..." rows="5"></textarea>
                    </div>
                </div>

                <!-- Common: Additional Notes -->
                <div class="sw-form-group sw-mt-lg">
                    <label class="sw-label">Additional Notes</label>
                    <textarea class="sw-textarea" ng-model="c.formData.notes"
                              placeholder="Any additional information..." rows="3"></textarea>
                </div>

                <!-- File Upload -->
                <div class="sw-form-group sw-mt-lg">
                    <label class="sw-label">Supporting Documents</label>
                    <div class="sw-file-upload">
                        <i class="material-icons">cloud_upload</i>
                        <span>Drag files here or click to upload</span>
                        <input type="file" class="sw-file-upload__input" multiple
                               onchange="angular.element(this).scope().c.handleFiles(this.files)">
                    </div>
                    <div class="sw-file-list" ng-if="c.uploadedFiles.length > 0">
                        <div class="sw-file-item" ng-repeat="file in c.uploadedFiles">
                            <i class="material-icons">insert_drive_file</i>
                            <span>{{file.name}}</span>
                            <button class="sw-btn sw-btn--ghost sw-btn--sm" ng-click="c.removeFile($index)">
                                <i class="material-icons">close</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 4: Review & Submit -->
        <div class="sw-wizard__content sw-card" ng-if="c.currentStep === 3">
            <div class="sw-card__body">
                <h3 class="sw-mb-lg">Review & Submit</h3>

                <!-- Request Type & Priority -->
                <div class="sw-review-section sw-mb-lg">
                    <h4 class="sw-review-section__title" ng-click="c.toggleSection('type')">
                        <i class="material-icons">{{c.sections.type ? 'expand_less' : 'expand_more'}}</i>
                        Request Type & Priority
                    </h4>
                    <div class="sw-review-section__body" ng-if="c.sections.type">
                        <div class="sw-info-row">
                            <span class="sw-info-row__label">Request Type</span>
                            <span class="sw-info-row__value">{{c.getSelectedTypeLabel()}}</span>
                        </div>
                        <div class="sw-info-row">
                            <span class="sw-info-row__label">Priority</span>
                            <span class="sw-info-row__value sw-priority sw-priority--{{c.formData.priority}}">
                                <i class="material-icons">flag</i> {{c.getPriorityLabel()}}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Policy & Customer -->
                <div class="sw-review-section sw-mb-lg">
                    <h4 class="sw-review-section__title" ng-click="c.toggleSection('policy')">
                        <i class="material-icons">{{c.sections.policy ? 'expand_less' : 'expand_more'}}</i>
                        Policy & Customer Information
                    </h4>
                    <div class="sw-review-section__body" ng-if="c.sections.policy">
                        <div class="sw-info-row">
                            <span class="sw-info-row__label">Policy Number</span>
                            <span class="sw-info-row__value">{{c.formData.policy_number}}</span>
                        </div>
                        <div class="sw-info-row">
                            <span class="sw-info-row__label">Customer Name</span>
                            <span class="sw-info-row__value">{{c.formData.customer_name}}</span>
                        </div>
                        <div class="sw-info-row" ng-if="c.formData.phone">
                            <span class="sw-info-row__label">Phone</span>
                            <span class="sw-info-row__value">{{c.formData.phone}}</span>
                        </div>
                        <div class="sw-info-row" ng-if="c.formData.email">
                            <span class="sw-info-row__label">Email</span>
                            <span class="sw-info-row__value">{{c.formData.email}}</span>
                        </div>
                    </div>
                </div>

                <!-- Request Details -->
                <div class="sw-review-section sw-mb-lg">
                    <h4 class="sw-review-section__title" ng-click="c.toggleSection('details')">
                        <i class="material-icons">{{c.sections.details ? 'expand_less' : 'expand_more'}}</i>
                        Request Details
                    </h4>
                    <div class="sw-review-section__body" ng-if="c.sections.details">
                        <div class="sw-info-row" ng-repeat="field in c.getReviewDetails()">
                            <span class="sw-info-row__label">{{field.label}}</span>
                            <span class="sw-info-row__value">{{field.value}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="sw-wizard__nav">
            <button class="sw-btn sw-btn--secondary" ng-if="c.currentStep > 0" ng-click="c.prevStep()">
                <i class="material-icons">arrow_back</i> Previous
            </button>
            <div class="sw-flex--1"></div>
            <button class="sw-btn sw-btn--primary" ng-if="c.currentStep < 3"
                    ng-click="c.nextStep()" ng-disabled="!c.isStepValid()">
                Next <i class="material-icons">arrow_forward</i>
            </button>
            <button class="sw-btn sw-btn--primary sw-btn--lg" ng-if="c.currentStep === 3"
                    ng-click="c.submitRequest()" ng-disabled="c.submitting">
                <i class="material-icons" ng-if="!c.submitting">send</i>
                <i class="material-icons sw-animate-spin" ng-if="c.submitting">autorenew</i>
                {{c.submitting ? 'Submitting...' : 'Submit Request'}}
            </button>
        </div>
    </div>
</div>
`,
    customCss: `/* =============================================================================&#13;
   sw-service-request-wizard - 4-Step Service Request Wizard Styles&#13;
   ============================================================================= */&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Wizard Container&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-wizard {&#13;
  max-width: 820px;&#13;
  margin: 0 auto;&#13;
  padding: var(--sw-spacing-lg) 0;&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Step Progress Bar&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-wizard__progress {&#13;
  display: flex;&#13;
  align-items: flex-start;&#13;
  justify-content: center;&#13;
  margin-bottom: var(--sw-spacing-xl);&#13;
  padding: 0 var(--sw-spacing-md);&#13;
}&#13;
&#13;
.sw-wizard__step {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  align-items: center;&#13;
  position: relative;&#13;
  flex: 1;&#13;
  min-width: 0;&#13;
}&#13;
&#13;
.sw-wizard__step-circle {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  width: 36px;&#13;
  height: 36px;&#13;
  border-radius: 50%;&#13;
  background-color: var(--sw-color-bg-tertiary);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  border: 2px solid var(--sw-color-border);&#13;
  transition: all var(--sw-transition-normal);&#13;
  position: relative;&#13;
  z-index: 1;&#13;
&#13;
  .material-icons {&#13;
    font-size: 18px;&#13;
  }&#13;
}&#13;
&#13;
.sw-wizard__step--active .sw-wizard__step-circle {&#13;
  background-color: var(--sw-color-primary);&#13;
  color: #ffffff;&#13;
  border-color: var(--sw-color-primary);&#13;
  box-shadow: 0 0 0 4px rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.2);&#13;
}&#13;
&#13;
.sw-wizard__step--completed .sw-wizard__step-circle {&#13;
  background-color: var(--sw-color-success);&#13;
  color: #ffffff;&#13;
  border-color: var(--sw-color-success);&#13;
}&#13;
&#13;
.sw-wizard__step-label {&#13;
  display: block;&#13;
  margin-top: var(--sw-spacing-xs);&#13;
  font-size: var(--sw-font-size-xs);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  text-align: center;&#13;
  white-space: nowrap;&#13;
  transition: color var(--sw-transition-normal);&#13;
}&#13;
&#13;
.sw-wizard__step--active .sw-wizard__step-label {&#13;
  color: var(--sw-color-primary);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
}&#13;
&#13;
.sw-wizard__step--completed .sw-wizard__step-label {&#13;
  color: var(--sw-color-success);&#13;
}&#13;
&#13;
.sw-wizard__step-line {&#13;
  position: absolute;&#13;
  top: 18px;&#13;
  left: calc(50% + 22px);&#13;
  right: calc(-50% + 22px);&#13;
  height: 2px;&#13;
  background-color: var(--sw-color-border);&#13;
  z-index: 0;&#13;
  transition: background-color var(--sw-transition-normal);&#13;
}&#13;
&#13;
.sw-wizard__step--completed .sw-wizard__step-line {&#13;
  background-color: var(--sw-color-success);&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Content Card&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-wizard__content {&#13;
  animation: sw-fade-slide-in 0.3s ease-out;&#13;
}&#13;
&#13;
@keyframes sw-fade-slide-in {&#13;
  from {&#13;
    opacity: 0;&#13;
    transform: translateY(8px);&#13;
  }&#13;
  to {&#13;
    opacity: 1;&#13;
    transform: translateY(0);&#13;
  }&#13;
}&#13;
&#13;
.sw-wizard__content.sw-card {&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-radius: var(--sw-radius-lg);&#13;
  box-shadow: var(--sw-shadow-sm);&#13;
}&#13;
&#13;
.sw-wizard__content .sw-card__body {&#13;
  padding: var(--sw-spacing-xl);&#13;
}&#13;
&#13;
.sw-wizard__content .sw-card__body h3 {&#13;
  font-size: var(--sw-font-size-lg);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  color: var(--sw-color-text-primary);&#13;
  margin: 0;&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Form Elements&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-form-group {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  gap: var(--sw-spacing-xs);&#13;
}&#13;
&#13;
.sw-form-row {&#13;
  display: flex;&#13;
  gap: var(--sw-spacing-md);&#13;
  margin-bottom: var(--sw-spacing-md);&#13;
}&#13;
&#13;
.sw-flex--1 {&#13;
  flex: 1;&#13;
  min-width: 0;&#13;
}&#13;
&#13;
.sw-label {&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-secondary);&#13;
&#13;
  &--required::after {&#13;
    content: ' *';&#13;
    color: var(--sw-color-error);&#13;
  }&#13;
}&#13;
&#13;
.sw-input,&#13;
.sw-select,&#13;
.sw-textarea {&#13;
  width: 100%;&#13;
  padding: var(--sw-spacing-sm) var(--sw-spacing-md);&#13;
  font-size: var(--sw-font-size-base);&#13;
  font-family: inherit;&#13;
  color: var(--sw-color-text-primary);&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  border: 1px solid var(--sw-color-border);&#13;
  border-radius: var(--sw-radius-md);&#13;
  transition: border-color var(--sw-transition-fast),&#13;
              box-shadow var(--sw-transition-fast);&#13;
  box-sizing: border-box;&#13;
&#13;
  &::placeholder {&#13;
    color: var(--sw-color-text-tertiary);&#13;
  }&#13;
&#13;
  &:focus {&#13;
    outline: none;&#13;
    border-color: var(--sw-color-primary);&#13;
    box-shadow: 0 0 0 3px rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.15);&#13;
  }&#13;
}&#13;
&#13;
.sw-select {&#13;
  appearance: none;&#13;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");&#13;
  background-repeat: no-repeat;&#13;
  background-position: right 12px center;&#13;
  padding-right: 36px;&#13;
  cursor: pointer;&#13;
}&#13;
&#13;
.sw-textarea {&#13;
  resize: vertical;&#13;
  min-height: 80px;&#13;
  line-height: var(--sw-line-height);&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Radio Group (Priority Pill Selector)&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-radio-group {&#13;
  display: flex;&#13;
  flex-wrap: wrap;&#13;
  gap: var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-radio {&#13;
  position: relative;&#13;
  cursor: pointer;&#13;
&#13;
  input[type="radio"] {&#13;
    position: absolute;&#13;
    opacity: 0;&#13;
    width: 0;&#13;
    height: 0;&#13;
  }&#13;
}&#13;
&#13;
.sw-radio__label {&#13;
  display: inline-flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
  padding: var(--sw-spacing-sm) var(--sw-spacing-md);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  border: 2px solid var(--sw-color-border);&#13;
  border-radius: var(--sw-radius-full);&#13;
  background-color: var(--sw-color-bg-primary);&#13;
  color: var(--sw-color-text-secondary);&#13;
  transition: all var(--sw-transition-fast);&#13;
  user-select: none;&#13;
&#13;
  .material-icons {&#13;
    font-size: 16px;&#13;
  }&#13;
}&#13;
&#13;
.sw-radio__label:hover {&#13;
  border-color: var(--sw-color-border-dark, var(--sw-color-text-tertiary));&#13;
  background-color: var(--sw-color-bg-secondary);&#13;
}&#13;
&#13;
.sw-radio input[type="radio"]:checked + .sw-radio__label {&#13;
  border-color: var(--sw-color-primary);&#13;
  background-color: rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.08);&#13;
  color: var(--sw-color-primary);&#13;
&#13;
  &.sw-priority--low {&#13;
    border-color: var(--sw-priority-low);&#13;
    background-color: rgba(var(--sw-priority-low-rgb, 34, 197, 94), 0.08);&#13;
    color: var(--sw-priority-low);&#13;
  }&#13;
&#13;
  &.sw-priority--medium {&#13;
    border-color: var(--sw-priority-medium);&#13;
    background-color: rgba(var(--sw-priority-medium-rgb, 234, 179, 8), 0.08);&#13;
    color: var(--sw-priority-medium);&#13;
  }&#13;
&#13;
  &.sw-priority--high {&#13;
    border-color: var(--sw-priority-high);&#13;
    background-color: rgba(var(--sw-priority-high-rgb, 249, 115, 22), 0.08);&#13;
    color: var(--sw-priority-high);&#13;
  }&#13;
&#13;
  &.sw-priority--urgent {&#13;
    border-color: var(--sw-priority-urgent);&#13;
    background-color: rgba(var(--sw-priority-urgent-rgb, 239, 68, 68), 0.08);&#13;
    color: var(--sw-priority-urgent);&#13;
  }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Alert / Info Box&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-alert {&#13;
  display: flex;&#13;
  align-items: flex-start;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-md);&#13;
  border-radius: var(--sw-radius-md);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  line-height: var(--sw-line-height);&#13;
&#13;
  .material-icons {&#13;
    font-size: 20px;&#13;
    flex-shrink: 0;&#13;
    margin-top: 1px;&#13;
  }&#13;
&#13;
  &--info {&#13;
    background-color: rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.08);&#13;
    color: var(--sw-color-primary);&#13;
    border: 1px solid rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.2);&#13;
  }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   File Upload&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-file-upload {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-xl) var(--sw-spacing-lg);&#13;
  border: 2px dashed var(--sw-color-border);&#13;
  border-radius: var(--sw-radius-md);&#13;
  background-color: var(--sw-color-bg-secondary);&#13;
  color: var(--sw-color-text-tertiary);&#13;
  cursor: pointer;&#13;
  transition: border-color var(--sw-transition-fast),&#13;
              background-color var(--sw-transition-fast);&#13;
  position: relative;&#13;
&#13;
  .material-icons {&#13;
    font-size: 32px;&#13;
    color: var(--sw-color-text-tertiary);&#13;
  }&#13;
&#13;
  span {&#13;
    font-size: var(--sw-font-size-sm);&#13;
  }&#13;
&#13;
  &:hover {&#13;
    border-color: var(--sw-color-primary);&#13;
    background-color: rgba(var(--sw-color-primary-rgb, 59, 130, 246), 0.04);&#13;
  }&#13;
}&#13;
&#13;
.sw-file-upload__input {&#13;
  position: absolute;&#13;
  inset: 0;&#13;
  width: 100%;&#13;
  height: 100%;&#13;
  opacity: 0;&#13;
  cursor: pointer;&#13;
}&#13;
&#13;
.sw-file-list {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  gap: var(--sw-spacing-xs);&#13;
  margin-top: var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-file-item {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-sm) var(--sw-spacing-md);&#13;
  background-color: var(--sw-color-bg-secondary);&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-radius: var(--sw-radius-sm);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  color: var(--sw-color-text-primary);&#13;
&#13;
  .material-icons {&#13;
    font-size: 18px;&#13;
    color: var(--sw-color-text-tertiary);&#13;
    flex-shrink: 0;&#13;
  }&#13;
&#13;
  span {&#13;
    flex: 1;&#13;
    min-width: 0;&#13;
    overflow: hidden;&#13;
    text-overflow: ellipsis;&#13;
    white-space: nowrap;&#13;
  }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Review Sections (Collapsible)&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-review-section {&#13;
  border: 1px solid var(--sw-color-border-light);&#13;
  border-radius: var(--sw-radius-md);&#13;
  overflow: hidden;&#13;
}&#13;
&#13;
.sw-review-section__title {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-md) var(--sw-spacing-lg);&#13;
  margin: 0;&#13;
  font-size: var(--sw-font-size-base);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  color: var(--sw-color-text-primary);&#13;
  background-color: var(--sw-color-bg-secondary);&#13;
  cursor: pointer;&#13;
  user-select: none;&#13;
  transition: background-color var(--sw-transition-fast);&#13;
&#13;
  .material-icons {&#13;
    font-size: 20px;&#13;
    color: var(--sw-color-text-tertiary);&#13;
  }&#13;
&#13;
  &:hover {&#13;
    background-color: var(--sw-color-bg-tertiary);&#13;
  }&#13;
}&#13;
&#13;
.sw-review-section__body {&#13;
  padding: var(--sw-spacing-sm) var(--sw-spacing-lg);&#13;
}&#13;
&#13;
.sw-review-section__body .sw-info-row {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-sm);&#13;
  padding: var(--sw-spacing-sm) 0;&#13;
  border-bottom: 1px solid var(--sw-color-border-light);&#13;
  font-size: var(--sw-font-size-base);&#13;
&#13;
  &:last-child {&#13;
    border-bottom: none;&#13;
  }&#13;
}&#13;
&#13;
.sw-review-section__body .sw-info-row__label {&#13;
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
.sw-review-section__body .sw-info-row__value {&#13;
  flex: 1;&#13;
  font-weight: var(--sw-font-weight-medium);&#13;
  color: var(--sw-color-text-primary);&#13;
  word-break: break-word;&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Navigation Bar&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-wizard__nav {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: space-between;&#13;
  margin-top: var(--sw-spacing-lg);&#13;
  padding-top: var(--sw-spacing-lg);&#13;
  gap: var(--sw-spacing-md);&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Buttons&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-btn {&#13;
  display: inline-flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
  padding: var(--sw-spacing-sm) var(--sw-spacing-lg);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  font-family: inherit;&#13;
  border: none;&#13;
  border-radius: var(--sw-radius-md);&#13;
  cursor: pointer;&#13;
  transition: all var(--sw-transition-fast);&#13;
  white-space: nowrap;&#13;
  text-decoration: none;&#13;
  line-height: 1.5;&#13;
&#13;
  .material-icons {&#13;
    font-size: 18px;&#13;
  }&#13;
&#13;
  &:disabled {&#13;
    opacity: 0.5;&#13;
    cursor: not-allowed;&#13;
  }&#13;
&#13;
  &--primary {&#13;
    background-color: var(--sw-color-primary);&#13;
    color: #ffffff;&#13;
&#13;
    &:hover:not(:disabled) {&#13;
      filter: brightness(1.1);&#13;
      box-shadow: var(--sw-shadow-sm);&#13;
    }&#13;
  }&#13;
&#13;
  &--secondary {&#13;
    background-color: var(--sw-color-bg-secondary);&#13;
    color: var(--sw-color-text-secondary);&#13;
    border: 1px solid var(--sw-color-border);&#13;
&#13;
    &:hover:not(:disabled) {&#13;
      background-color: var(--sw-color-bg-tertiary);&#13;
    }&#13;
  }&#13;
&#13;
  &--ghost {&#13;
    background: none;&#13;
    color: var(--sw-color-text-tertiary);&#13;
    padding: var(--sw-spacing-xs);&#13;
&#13;
    &:hover {&#13;
      color: var(--sw-color-text-primary);&#13;
      background-color: var(--sw-color-bg-tertiary);&#13;
    }&#13;
  }&#13;
&#13;
  &--sm {&#13;
    padding: var(--sw-spacing-xs);&#13;
    font-size: var(--sw-font-size-xs);&#13;
&#13;
    .material-icons {&#13;
      font-size: 16px;&#13;
    }&#13;
  }&#13;
&#13;
  &--lg {&#13;
    padding: var(--sw-spacing-md) var(--sw-spacing-xl);&#13;
    font-size: var(--sw-font-size-base);&#13;
  }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Success Screen&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-wizard__success {&#13;
  display: flex;&#13;
  flex-direction: column;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  text-align: center;&#13;
  padding: var(--sw-spacing-xl) var(--sw-spacing-lg);&#13;
  min-height: 360px;&#13;
  animation: sw-fade-slide-in 0.4s ease-out;&#13;
}&#13;
&#13;
.sw-wizard__success-icon {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  width: 72px;&#13;
  height: 72px;&#13;
  border-radius: 50%;&#13;
  background-color: rgba(var(--sw-color-success-rgb, 34, 197, 94), 0.12);&#13;
  margin-bottom: var(--sw-spacing-lg);&#13;
&#13;
  .material-icons {&#13;
    font-size: 40px;&#13;
    color: var(--sw-color-success);&#13;
  }&#13;
}&#13;
&#13;
.sw-wizard__success h2 {&#13;
  font-size: var(--sw-font-size-xl);&#13;
  font-weight: var(--sw-font-weight-semibold);&#13;
  color: var(--sw-color-text-primary);&#13;
  margin: 0 0 var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-wizard__success p {&#13;
  font-size: var(--sw-font-size-base);&#13;
  color: var(--sw-color-text-secondary);&#13;
  margin: 0 0 var(--sw-spacing-sm);&#13;
}&#13;
&#13;
.sw-wizard__success .sw-text-muted {&#13;
  color: var(--sw-color-text-tertiary);&#13;
  font-size: var(--sw-font-size-sm);&#13;
  margin-bottom: var(--sw-spacing-lg);&#13;
}&#13;
&#13;
.sw-wizard__success .sw-btn {&#13;
  margin-top: var(--sw-spacing-md);&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Priority Indicator (inline)&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-priority {&#13;
  display: inline-flex;&#13;
  align-items: center;&#13;
  gap: var(--sw-spacing-xs);&#13;
&#13;
  .material-icons {&#13;
    font-size: 16px;&#13;
  }&#13;
&#13;
  &--low {&#13;
    color: var(--sw-priority-low);&#13;
  }&#13;
  &--medium {&#13;
    color: var(--sw-priority-medium);&#13;
  }&#13;
  &--high {&#13;
    color: var(--sw-priority-high);&#13;
  }&#13;
  &--urgent {&#13;
    color: var(--sw-priority-urgent);&#13;
  }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Spin Animation&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-animate-spin {&#13;
  animation: sw-spin 1s linear infinite;&#13;
}&#13;
&#13;
@keyframes sw-spin {&#13;
  from { transform: rotate(0deg); }&#13;
  to { transform: rotate(360deg); }&#13;
}&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Utility Spacers&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
.sw-mb-md { margin-bottom: var(--sw-spacing-md); }&#13;
.sw-mb-lg { margin-bottom: var(--sw-spacing-lg); }&#13;
.sw-mt-md { margin-top: var(--sw-spacing-md); }&#13;
.sw-mt-lg { margin-top: var(--sw-spacing-lg); }&#13;
&#13;
/* ---------------------------------------------------------------------------&#13;
   Responsive / Media Queries&#13;
   --------------------------------------------------------------------------- */&#13;
&#13;
@media (max-width: 640px) {&#13;
  .sw-wizard__progress {&#13;
    padding: 0;&#13;
  }&#13;
&#13;
  .sw-wizard__step-label {&#13;
    display: none;&#13;
  }&#13;
&#13;
  .sw-wizard__step-line {&#13;
    top: 18px;&#13;
    left: calc(50% + 20px);&#13;
    right: calc(-50% + 20px);&#13;
  }&#13;
&#13;
  .sw-form-row {&#13;
    flex-direction: column;&#13;
    gap: var(--sw-spacing-md);&#13;
  }&#13;
&#13;
  .sw-wizard__content .sw-card__body {&#13;
    padding: var(--sw-spacing-lg);&#13;
  }&#13;
&#13;
  .sw-review-section__body .sw-info-row {&#13;
    flex-direction: column;&#13;
    align-items: flex-start;&#13;
    gap: var(--sw-spacing-xs);&#13;
  }&#13;
&#13;
  .sw-review-section__body .sw-info-row__label {&#13;
    width: auto;&#13;
    min-width: auto;&#13;
  }&#13;
&#13;
  .sw-wizard__nav {&#13;
    flex-wrap: wrap;&#13;
  }&#13;
&#13;
  .sw-btn--lg {&#13;
    width: 100%;&#13;
    justify-content: center;&#13;
  }&#13;
}&#13;`,
    id: 'sw-service-request-wizard',
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
})
