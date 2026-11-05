/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T08:44:38.598Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{nt as e,q as t}from"./lz9snzk0.js";function n(e){return typeof e!=`string`||!e.includes(`var(--mantine-scale)`)?e:e.match(/^calc\((.*?)\)$/)?.[1].split(`*`)[0].trim()}function r(e){let t=n(e);return typeof t==`number`?t:typeof t==`string`?t.includes(`calc`)||t.includes(`var`)?t:t.includes(`px`)?Number(t.replace(`px`,``)):t.includes(`rem`)?Number(t.replace(`rem`,``))*16:t.includes(`em`)?Number(t.replace(`em`,``))*16:Number(t):NaN}var i=e(t(),1);function a({value:e,defaultValue:t,finalValue:n,onChange:r=()=>{}}){let[a,o]=(0,i.useState)(t===void 0?n:t);return e===void 0?[a,(e,...t)=>{o(e),r?.(e,...t)},!1]:[e,r,!0]}export{r as n,a as t};