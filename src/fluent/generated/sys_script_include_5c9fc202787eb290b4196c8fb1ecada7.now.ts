import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5c9fc202787eb290b4196c8fb1ecada7'],
    name: 'SmartWorkspaceUtil',
    script: Now.include('./sys_script_include_5c9fc202787eb290b4196c8fb1ecada7.js'),
    apiName: 'x_dxcis_smart_st_0.SmartWorkspaceUtil',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    accessibleFrom: 'public',
    active: true,
    protectionPolicy: 'read',
})
