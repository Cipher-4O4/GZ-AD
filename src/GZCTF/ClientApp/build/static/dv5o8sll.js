/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-07T04:20:27.833Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
function e(e,t){let n=t.trim().toLowerCase();if(n===``)return;let r=Object.values(e).filter(e=>!e.disabled&&e.label.trim().toLowerCase()===n);return r.length===1?r[0]:void 0}export{e as t};