import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['92112c101d07361062a3fd68f681ceb5'],
    table: 'sp_css',
    data: {
        css: `:root {&#13;
    --sw-sidenav-width: 24rem;&#13;
  --sw-header-height: clamp(56px, 6vh, 72px);&#13;
}&#13;
&#13;
/* MAIN page content */&#13;
main.body {&#13;
    margin-left: var(--sw-sidenav-width);&#13;
    max-width: calc(100% - var(--sw-sidenav-width));&#13;
  /* Offset for fixed header */&#13;
  padding-top: var(--sw-header-height);&#13;
    /* overflow-x: hidden; */&#13;
}&#13;
&#13;
/* Prevent horizontal scrolling &#13;
html,&#13;
body {&#13;
    overflow-x: hidden;&#13;
} */&#13;
&#13;`,
        name: 'sw-layout',
        turn_off_scss_compilation: 'false',
    },
})
