import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6ebfc602787eb290b4196c8fb1ecadb9'],
    name: 'SmartWorkspaceTheme',
    script: Now.include('./sys_script_include_6ebfc602787eb290b4196c8fb1ecadb9.js'),
    apiName: 'x_dxcis_smart_st_0.SmartWorkspaceTheme',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    accessibleFrom: 'public',
    active: true,
    protectionPolicy: 'read',
})
