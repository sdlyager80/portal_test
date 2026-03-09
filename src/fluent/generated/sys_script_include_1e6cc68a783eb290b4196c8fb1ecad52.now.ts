import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['1e6cc68a783eb290b4196c8fb1ecad52'],
    name: 'SmartWorkspaceConfig',
    script: Now.include('./sys_script_include_1e6cc68a783eb290b4196c8fb1ecad52.js'),
    apiName: 'x_dxcis_smart_st_0.SmartWorkspaceConfig',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    accessibleFrom: 'public',
    active: true,
    protectionPolicy: 'read',
})
