/**
 * SmartWorkspaceTheme - Theme preference management
 *
 * Handles reading and writing user theme preferences.
 * The preference table is CONFIGURABLE - pass it in the constructor
 * or via widget options to point at a different table.
 *
 * Usage in widget server scripts:
 *   // With default table:
 *   var themeUtil = new SmartWorkspaceTheme();
 *
 *   // With custom table from widget options:
 *   var themeUtil = new SmartWorkspaceTheme({
 *       preference_table: options.table_user_preference || 'x_dxcis_smart_st_0_user_preference'
 *   });
 *
 *   data.theme = themeUtil.getUserTheme(gs.getUserID());
 */

var SmartWorkspaceTheme = Class.create();
SmartWorkspaceTheme.prototype = {
    PREFERENCE_KEY: 'theme',
    DEFAULT_THEME: 'default',
    VALID_THEMES: ['default', 'dark', 'brand_alt'],
    DEFAULT_PREFERENCE_TABLE: 'x_dxcis_smart_st_0_user_preference',

    /**
     * @param {Object} [config] - Optional configuration
     * @param {string} [config.preference_table] - Table to store preferences
     */
    initialize: function(config) {
        config = config || {};
        this.preferenceTable = config.preference_table || this.DEFAULT_PREFERENCE_TABLE;
    },

    /**
     * Get the current user's theme preference
     * @param {string} userId - sys_id of the user
     * @returns {string} Theme name ('default', 'dark', 'brand_alt')
     */
    getUserTheme: function(userId) {
        var gr = new GlideRecord(this.preferenceTable);
        gr.addQuery('user', userId);
        gr.addQuery('preference_key', this.PREFERENCE_KEY);
        gr.query();

        if (gr.next()) {
            var theme = gr.getValue('preference_value');
            if (this.VALID_THEMES.indexOf(theme) !== -1) {
                return theme;
            }
        }

        return this.DEFAULT_THEME;
    },

    /**
     * Set the user's theme preference
     * @param {string} userId - sys_id of the user
     * @param {string} theme - Theme name to set
     * @returns {boolean} Success
     */
    setUserTheme: function(userId, theme) {
        // Validate theme name
        if (this.VALID_THEMES.indexOf(theme) === -1) {
            gs.warn('SmartWorkspaceTheme: Invalid theme "' + theme + '"');
            return false;
        }

        var gr = new GlideRecord(this.preferenceTable);
        gr.addQuery('user', userId);
        gr.addQuery('preference_key', this.PREFERENCE_KEY);
        gr.query();

        if (gr.next()) {
            // Update existing preference
            gr.setValue('preference_value', theme);
            gr.update();
        } else {
            // Create new preference
            gr.initialize();
            gr.setValue('user', userId);
            gr.setValue('preference_key', this.PREFERENCE_KEY);
            gr.setValue('preference_value', theme);
            gr.insert();
        }

        return true;
    },

    /**
     * Get available themes for display in the theme switcher
     * @returns {Array} Array of theme option objects
     */
    getAvailableThemes: function() {
        return [
            {
                value: 'default',
                label: 'Light',
                description: 'Default light theme',
                icon: 'light_mode',
                bodyClass: 'sw-theme-default'
            },
            {
                value: 'dark',
                label: 'Dark',
                description: 'Dark background with light text',
                icon: 'dark_mode',
                bodyClass: 'sw-theme-dark'
            },
            {
                value: 'brand_alt',
                label: 'Teal',
                description: 'Alternate brand colors',
                icon: 'palette',
                bodyClass: 'sw-theme-brand-alt'
            }
        ];
    },

    /**
     * Get the CSS body class for a theme name
     * @param {string} theme - Theme name
     * @returns {string} CSS class name for the body element
     */
    getBodyClass: function(theme) {
        var themes = this.getAvailableThemes();
        for (var i = 0; i < themes.length; i++) {
            if (themes[i].value === theme) {
                return themes[i].bodyClass;
            }
        }
        return 'sw-theme-default';
    },

    type: 'SmartWorkspaceTheme'
};
