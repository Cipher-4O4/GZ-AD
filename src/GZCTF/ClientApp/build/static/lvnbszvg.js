/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{Y as e,it as t}from"./dn2mmff4.js";var n=t(e(),1);function r(e={}){let t=e.timeout??2e3,[r,i]=(0,n.useState)(null),[a,o]=(0,n.useState)(!1),s=(0,n.useRef)(null);(0,n.useEffect)(()=>()=>{window.clearTimeout(s.current)},[]);let c=e=>{window.clearTimeout(s.current),s.current=window.setTimeout(()=>o(!1),t),o(e)};return{copy:e=>{`clipboard`in navigator?navigator.clipboard.writeText(e).then(()=>{i(null),c(!0)}).catch(e=>i(e)):i(Error(`useClipboard: navigator.clipboard is not supported`))},reset:()=>{o(!1),i(null),window.clearTimeout(s.current)},error:r,copied:a}}export{r as t};