import { SPWidget } from '@servicenow/sdk/core'

SPWidget({
    $id: Now.ID['4fd08fe41d4fb61062a3fd68f681cec2'],
    name: 'Retirement Illustration',
    clientScript: `api.controller = function($scope, $element, $timeout) {
    var c = this;

    c.currentChart = null;
    c.showIllustrationPrompt = true; // Show AI prompt initially
    c.activeTab = 'noWithdrawal';

    var policyData = {
        years: [0, 5, 10, 15, 20, 25, 30],
        ages: [65, 70, 75, 80, 85, 90, 95],
        surrenderValueNoWithdrawal: [850000, 920000, 995000, 1075000, 1160000, 1250000, 1345000],
        surrenderValueWith30k: [850000, 765000, 685000, 610000, 540000, 475000, 415000],
        surrenderValueWith50k: [850000, 670000, 495000, 325000, 160000, 0, 0],
        deathBenefit: [225000, 225000, 225000, 225000, 225000, 225000, 225000]
    };

    // Button handler to generate illustration
    c.generateIllustration = function() {
        c.showIllustrationPrompt = false;
        $timeout(function() {
            c.showChart('noWithdrawal');
        }, 300);
    };

    c.showChart = function(type) {
        c.activeTab = type;
        $timeout(() => {
            createChart(type);
        }, 0);
    };

    function createChart(type) {
        var ctx = document.getElementById('policyChart').getContext('2d');

        if (c.currentChart && typeof c.currentChart.destroy === 'function') {
            c.currentChart.destroy();
            c.currentChart = null;
        }

        var datasets = [];
        var title = '';

        switch (type) {
            case 'noWithdrawal':
                datasets = [{
                    label: 'Contract Value (No Withdrawals)',
                    data: policyData.surrenderValueNoWithdrawal,
                    borderColor: '#27AE60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4,
                    fill: true
                }];
                title = 'Contract Performance Without Withdrawals';
                break;

            case 'withdrawal30k':
                datasets = [{
                        label: 'No Withdrawals (Baseline)',
                        data: policyData.surrenderValueNoWithdrawal,
                        borderColor: '#95a5a6',
                        backgroundColor: 'rgba(149, 165, 166, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Contract Value ($30K/year)',
                        data: policyData.surrenderValueWith30k,
                        borderColor: '#3498DB',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ];
                title = '$30,000 Annual Withdrawals';
                break;

            case 'withdrawal50k':
                datasets = [{
                        label: 'No Withdrawals (Baseline)',
                        data: policyData.surrenderValueNoWithdrawal,
                        borderColor: '#95a5a6',
                        backgroundColor: 'rgba(149, 165, 166, 0.1)',
                        tension: 0.4,
                        fill: false,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Contract Value ($50K/year)',
                        data: policyData.surrenderValueWith50k,
                        borderColor: '#E74C3C',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ];
                title = '$50,000 Annual Withdrawals';
                break;
        }

        c.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: policyData.ages.map(function(age) {
                    return 'Age ' + age;
                }),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#2c3e50'
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#3498DB',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
};`,
    serverScript: `(function() {
  /* populate the 'data' object */
  /* e.g., data.table = $sp.getValue('table'); */

})();`,
    htmlTemplate: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="body widget-container">
  <div class="header">
    <div class="company-logo">
      <img src="upload_Bloom%20Insurance%20H%2072dpi.png"/>
    </div>
    <div class="policy-title">Annuity Scheduled Withdrawal Illustration</div>
    <div class="policy-number">Policy No: 00184596 | Status: Withdrawal Approved ✓</div>
  </div>

  <div class="main-content">
    <!-- Policy Information Cards -->
    <div class="info-grid">
      <div class="info-card pulse">
        <h3>Policy Holder</h3>
        <div class="value">Charles John</div>
        <div class="subtext">Male, 65 years (Retired)</div>
      </div>
      <div class="info-card">
        <h3>Current Value</h3>
        <div class="value">$ 850,000</div>
        <div class="subtext">As of Feb 2026</div>
      </div>
      <div class="info-card">
        <h3>Requested Withdrawal</h3>
        <div class="value">$ 30,000/year</div>
        <div class="subtext">Monthly: $2,500</div>
      </div>
      <div class="info-card">
        <h3>Start Date</h3>
        <div class="value">March 1, 2026</div>
        <div class="subtext">Approved & Scheduled</div>
      </div>
      <div class="info-card">
        <h3>Contract Type</h3>
        <div class="value">Fixed Annuity</div>
        <div class="subtext">With Living Benefits</div>
      </div>
      <div class="info-card">
        <h3>Death Benefit</h3>
        <div class="value">$ 225,000</div>
        <div class="subtext">Protected Coverage</div>
      </div>
    </div>

    <!-- Withdrawal Request Section -->
    <div class="withdrawal-request-section">
      <div class="withdrawal-request-title">
        <span class="check-icon">✓</span>
        <span>Scheduled Withdrawal Request - Automatically Verified</span>
      </div>
      <div class="withdrawal-details">
        <div class="withdrawal-detail-item">
          <h4>Requested Amount</h4>
          <div class="detail-value">$30,000 / year</div>
        </div>
        <div class="withdrawal-detail-item">
          <h4>Frequency</h4>
          <div class="detail-value">Monthly ($2,500)</div>
        </div>
        <div class="withdrawal-detail-item">
          <h4>Start Date</h4>
          <div class="detail-value">March 1, 2026</div>
        </div>
        <div class="withdrawal-detail-item">
          <h4>Withdrawal Limit Check</h4>
          <div class="detail-value">Within Limits ✓</div>
        </div>
        <div class="withdrawal-detail-item">
          <h4>Tax Withholding</h4>
          <div class="detail-value">10% Federal</div>
        </div>
        <div class="withdrawal-detail-item">
          <h4>Processing Status</h4>
          <div class="detail-value">Approved</div>
        </div>
      </div>
    </div>

    <!-- AI Proactive Guidance Section (shown initially) -->
    <div class="ai-prompt-section" ng-show="c.showIllustrationPrompt">
      <div class="ai-prompt-title">
        <span class="ai-icon">🤖</span>
        <span>AI-Powered Illustration Service</span>
      </div>
      <div class="ai-prompt-message">
        Your scheduled withdrawal has been verified and approved. Would you like to see an illustration showing how your contract is expected to perform with these scheduled withdrawals over time? This will help you understand the long-term impact on your contract value.
      </div>
      <button class="ai-prompt-button" ng-click="c.generateIllustration()">
        Generate My Illustration
      </button>
    </div>

    <!-- Chart Section (shown after button click) -->
    <div class="chart-container" ng-show="!c.showIllustrationPrompt">
      <div class="chart-title">Contract Performance with Scheduled Withdrawals</div>
      <div class="tabs">
        <button class="tab-button" ng-class="{active: c.activeTab === 'noWithdrawal'}" ng-click="c.showChart('noWithdrawal')">No Withdrawals</button>
        <button class="tab-button" ng-class="{active: c.activeTab === 'withdrawal30k'}" ng-click="c.showChart('withdrawal30k')">$30K Annual</button>
        <button class="tab-button" ng-class="{active: c.activeTab === 'withdrawal50k'}" ng-click="c.showChart('withdrawal50k')">$50K Annual</button>
      </div>
      <div class="chart-wrapper">
        <canvas id="policyChart"></canvas>
      </div>
    </div>

    <!-- Summary Section (shown after button click) -->
    <div class="summary-section" ng-show="!c.showIllustrationPrompt">
      <div class="summary-title">Withdrawal Impact - $30,000 Annual</div>
      <div class="summary-grid">
        <div class="summary-item">
          <h4>Contract Value at Age 70</h4>
          <div class="amount">$ 765,000</div>
        </div>
        <div class="summary-item">
          <h4>Contract Value at Age 80</h4>
          <div class="amount">$ 610,000</div>
        </div>
        <div class="summary-item">
          <h4>Contract Value at Age 90</h4>
          <div class="amount">$ 475,000</div>
        </div>
        <div class="summary-item">
          <h4>Total Withdrawn (25 yrs)</h4>
          <div class="amount">$ 750,000</div>
        </div>
      </div>
    </div>

    <!-- Alternative Scenarios (shown after button click) -->
    <div class="summary-section" ng-show="!c.showIllustrationPrompt">
      <div class="summary-title">Alternative Withdrawal Scenarios</div>
      <div class="summary-grid">
        <div class="summary-item">
          <h4>No Withdrawals - Age 90</h4>
          <div class="amount">$ 1,250,000</div>
        </div>
        <div class="summary-item">
          <h4>$30K/year - Age 90</h4>
          <div class="amount">$ 475,000</div>
        </div>
        <div class="summary-item">
          <h4>$50K/year - Age 85</h4>
          <div class="amount">$ 160,000</div>
        </div>
        <div class="summary-item">
          <h4>$50K/year - Depleted</h4>
          <div class="amount">Age 90</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
    customCss: `* {&#13;
  margin: 0;&#13;
  padding: 0;&#13;
  box-sizing: border-box;&#13;
}&#13;
&#13;
.body {&#13;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;&#13;
  background: linear-gradient(135deg, #2E86C1 0%, #3498DB 50%, #5DADE2 100%);&#13;
  min-height: 100vh;&#13;
  padding: 20px;&#13;
}&#13;
&#13;
.widget-container {&#13;
  max-width: 1400px;&#13;
  margin: 0 auto;&#13;
  background: rgba(255, 255, 255, 0.95);&#13;
  border-radius: 20px;&#13;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);&#13;
  overflow: hidden;&#13;
  backdrop-filter: blur(10px);&#13;
}&#13;
&#13;
.header {&#13;
  background: #f8f9fa;&#13;
  color: #2C3E50;&#13;
  padding: 20px 30px;&#13;
  text-align: center;&#13;
  border-bottom: 2px solid #5DADE2; /* blue from logo */&#13;
}&#13;
&#13;
.policy-title {&#13;
  font-size: 24px;&#13;
  font-weight: 600;&#13;
  margin-top: 10px;&#13;
}&#13;
&#13;
.policy-number {&#13;
  font-size: 14px;&#13;
  color: #7F8C8D;&#13;
}&#13;
&#13;
@keyframes shimmer {&#13;
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }&#13;
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }&#13;
}&#13;
&#13;
.company-logo {&#13;
  text-align: center;&#13;
  margin-bottom: 15px;&#13;
}&#13;
&#13;
.company-logo img {&#13;
  max-width: 400px; /* Adjust as needed */&#13;
  height: auto;&#13;
  display: inline-block;&#13;
}&#13;
&#13;
.main-content {&#13;
  padding: 30px;&#13;
}&#13;
&#13;
.info-grid {&#13;
  display: grid;&#13;
  grid-template-columns: repeat(3, 1fr); /* Exactly 3 cards per row */&#13;
  gap: 20px;&#13;
  margin-bottom: 30px;&#13;
}&#13;
&#13;
&#13;
.info-card {&#13;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);&#13;
  border-radius: 15px;&#13;
  padding: 25px;&#13;
  text-align: center;&#13;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);&#13;
  transition: all 0.3s ease;&#13;
  position: relative;&#13;
  overflow: hidden;&#13;
  border-left: 4px solid #3498DB;&#13;
}&#13;
&#13;
.info-card::before {&#13;
  content: '';&#13;
  position: absolute;&#13;
  top: 0;&#13;
  left: -100%;&#13;
  width: 100%;&#13;
  height: 100%;&#13;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);&#13;
  transition: left 0.5s;&#13;
}&#13;
&#13;
.info-card:hover::before {&#13;
  left: 100%;&#13;
}&#13;
&#13;
.info-card:hover {&#13;
  transform: translateY(-5px);&#13;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);&#13;
}&#13;
&#13;
.info-card h3 {&#13;
  color: #566573;&#13;
  margin-bottom: 10px;&#13;
  font-size: 16px;&#13;
  text-transform: uppercase;&#13;
  letter-spacing: 1px;&#13;
}&#13;
&#13;
.info-card .value {&#13;
  font-size: 24px;&#13;
  font-weight: bold;&#13;
  color: #27AE60;&#13;
  margin-bottom: 5px;&#13;
}&#13;
&#13;
.info-card .subtext {&#13;
  font-size: 14px;&#13;
  color: #7f8c8d;&#13;
}&#13;
&#13;
.chart-container {&#13;
  background: white;&#13;
  border-radius: 15px;&#13;
  padding: 25px;&#13;
  margin-bottom: 30px;&#13;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);&#13;
}&#13;
&#13;
.chart-title {&#13;
  font-size: 22px;&#13;
  color: #566573;&#13;
  margin-bottom: 20px;&#13;
  text-align: center;&#13;
  font-weight: 600;&#13;
}&#13;
&#13;
.chart-wrapper {&#13;
  position: relative;&#13;
  height: 400px;&#13;
  margin-bottom: 20px;&#13;
}&#13;
&#13;
.tabs {&#13;
  display: flex;&#13;
  justify-content: center;&#13;
  margin-bottom: 20px;&#13;
  background: #f8f9fa;&#13;
  border-radius: 10px;&#13;
  padding: 5px;&#13;
}&#13;
&#13;
.tab-button {&#13;
  background: transparent;&#13;
  border: none;&#13;
  padding: 12px 24px;&#13;
  border-radius: 8px;&#13;
  cursor: pointer;&#13;
  font-weight: 500;&#13;
  transition: all 0.3s ease;&#13;
  color: #7f8c8d;&#13;
}&#13;
&#13;
.tab-button.active {&#13;
  background: linear-gradient(135deg, #3498DB, #2E86C1);&#13;
  color: white;&#13;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);&#13;
}&#13;
&#13;
.tab-button:hover:not(.active) {&#13;
  background: rgba(52, 152, 219, 0.1);&#13;
  color: #3498DB;&#13;
}&#13;
&#13;
.summary-section {&#13;
  background: #f8f9fa;&#13;
  padding: 25px;&#13;
  margin-top: 20px;&#13;
  border-left: 4px solid #5DADE2;&#13;
  border-radius: 10px;&#13;
}&#13;
&#13;
.summary-title {&#13;
  font-size: 20px;&#13;
  color: #2C3E50;&#13;
  margin-bottom: 15px;&#13;
  text-align: center;&#13;
  font-weight: 600;&#13;
}&#13;
&#13;
.summary-grid {&#13;
  display: grid;&#13;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));&#13;
  gap: 15px;&#13;
}&#13;
&#13;
.summary-item {&#13;
  background: white;&#13;
  border-left: 4px solid #5DADE2;&#13;
  border-radius: 6px;&#13;
  padding: 15px;&#13;
  text-align: center;&#13;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);&#13;
}&#13;
&#13;
.summary-item h4 {&#13;
  color: #566573;&#13;
  margin-bottom: 8px;&#13;
  font-size: 14px;&#13;
}&#13;
&#13;
.summary-item .amount {&#13;
  font-size: 18px;&#13;
  font-weight: bold;&#13;
   color: #566573;&#13;
}&#13;
&#13;
.pulse {&#13;
  animation: pulse 2s infinite;&#13;
}&#13;
&#13;
@keyframes pulse {&#13;
  0% { transform: scale(1); }&#13;
  50% { transform: scale(1.05); }&#13;
  100% { transform: scale(1); }&#13;
}&#13;
&#13;
.loading {&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  height: 200px;&#13;
  font-size: 18px;&#13;
  color: #7f8c8d;&#13;
}&#13;
&#13;
.spinner {&#13;
  border: 3px solid #f3f3f3;&#13;
  border-top: 3px solid #3498db;&#13;
  border-radius: 50%;&#13;
  width: 30px;&#13;
  height: 30px;&#13;
  animation: spin 1s linear infinite;&#13;
  margin-right: 15px;&#13;
}&#13;
&#13;
@keyframes spin {&#13;
  0% { transform: rotate(0deg); }&#13;
  100% { transform: rotate(360deg); }&#13;
}&#13;
&#13;
@media (max-width: 768px) {&#13;
  .info-grid {&#13;
    grid-template-columns: 1fr;&#13;
  }&#13;
&#13;
  .tabs {&#13;
    flex-direction: column;&#13;
  }&#13;
&#13;
  .tab-button {&#13;
    margin-bottom: 5px;&#13;
  }&#13;
  &#13;
  .withdrawal-request-section {&#13;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);&#13;
  border-radius: 15px;&#13;
  padding: 25px;&#13;
  margin-bottom: 30px;&#13;
  border-left: 4px solid #27AE60;&#13;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);&#13;
}&#13;
&#13;
.withdrawal-request-title {&#13;
  font-size: 20px;&#13;
  font-weight: 600;&#13;
  color: #2C3E50;&#13;
  margin-bottom: 15px;&#13;
  display: flex;&#13;
  align-items: center;&#13;
  gap: 10px;&#13;
}&#13;
&#13;
.check-icon {&#13;
  color: #27AE60;&#13;
  font-size: 24px;&#13;
}&#13;
&#13;
.withdrawal-details {&#13;
  display: grid;&#13;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));&#13;
  gap: 15px;&#13;
  margin-top: 15px;&#13;
}&#13;
&#13;
.withdrawal-detail-item {&#13;
  background: white;&#13;
  padding: 15px;&#13;
  border-radius: 10px;&#13;
  border-left: 3px solid #27AE60;&#13;
}&#13;
&#13;
.withdrawal-detail-item h4 {&#13;
  font-size: 13px;&#13;
  color: #7f8c8d;&#13;
  margin-bottom: 8px;&#13;
  text-transform: uppercase;&#13;
  letter-spacing: 0.5px;&#13;
}&#13;
&#13;
.withdrawal-detail-item .detail-value {&#13;
  font-size: 18px;&#13;
  font-weight: 600;&#13;
  color: #2C3E50;&#13;
}&#13;
&#13;
.ai-prompt-section {&#13;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);&#13;
  border-radius: 15px;&#13;
  padding: 35px;&#13;
  margin-bottom: 30px;&#13;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);&#13;
  text-align: center;&#13;
  color: white;&#13;
  position: relative;&#13;
  overflow: hidden;&#13;
}&#13;
&#13;
.ai-prompt-section::before {&#13;
  content: '🤖';&#13;
  position: absolute;&#13;
  top: -20px;&#13;
  right: -20px;&#13;
  font-size: 120px;&#13;
  opacity: 0.1;&#13;
}&#13;
&#13;
.ai-prompt-title {&#13;
  font-size: 22px;&#13;
  font-weight: 600;&#13;
  margin-bottom: 15px;&#13;
  display: flex;&#13;
  align-items: center;&#13;
  justify-content: center;&#13;
  gap: 10px;&#13;
}&#13;
&#13;
.ai-icon {&#13;
  font-size: 28px;&#13;
  animation: pulse 2s infinite;&#13;
}&#13;
&#13;
.ai-prompt-message {&#13;
  font-size: 16px;&#13;
  line-height: 1.6;&#13;
  margin-bottom: 25px;&#13;
  opacity: 0.95;&#13;
}&#13;
&#13;
.ai-prompt-button {&#13;
  background: white;&#13;
  color: #667eea;&#13;
  border: none;&#13;
  padding: 15px 40px;&#13;
  border-radius: 30px;&#13;
  font-size: 16px;&#13;
  font-weight: 600;&#13;
  cursor: pointer;&#13;
  transition: all 0.3s ease;&#13;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);&#13;
}&#13;
&#13;
.ai-prompt-button:hover {&#13;
  transform: translateY(-3px);&#13;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);&#13;
  background: #f8f9fa;&#13;
}&#13;
}`,
    linkScript: `function link(scope, element, attrs, controller) {
  
}`,
    public: true,
})
