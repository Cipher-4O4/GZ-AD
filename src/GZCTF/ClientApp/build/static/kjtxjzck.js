/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-07T05:37:58.319Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{nt as e,q as t}from"./lz9snzk0.js";var n=e(t(),1);function r(e=!1,t={}){let[r,i]=(0,n.useState)(e),a=(0,n.useCallback)(()=>{i(e=>e||(t.onOpen?.(),!0))},[t.onOpen]),o=(0,n.useCallback)(()=>{i(e=>e&&(t.onClose?.(),!1))},[t.onClose]);return[r,{open:a,close:o,toggle:(0,n.useCallback)(()=>{r?o():a()},[o,a,r]),set:i}]}export{r as t};