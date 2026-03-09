import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['40efca02787eb290b4196c8fb1ecad73'],
    name: 'SmartWorkspaceSecurity',
    script: Now.include('./sys_script_include_40efca02787eb290b4196c8fb1ecad73.js'),
    apiName: 'x_dxcis_smart_st_0.SmartWorkspaceSecurity',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    accessibleFrom: 'public',
    active: true,
    protectionPolicy: 'read',
})
