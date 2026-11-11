/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-11T01:44:25.677Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{c as e,h as t,nt as n,q as r,y as i}from"./lz9snzk0.js";import{D as a,T as o}from"./h07r0bxo.js";var s=n(r(),1),c=i(),l=e(e=>{let{onChange:n,children:r,multiple:i,accept:l,name:u,form:d,resetRef:f,disabled:p,capture:m,inputProps:h,ref:g,..._}=t(`FileButton`,null,e),v=(0,s.useRef)(null),y=()=>{!p&&v.current?.click()};return o(f,()=>{v.current&&(v.current.value=``)}),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`input`,{style:{display:`none`},type:`file`,accept:l,multiple:i,onChange:e=>{if(e.currentTarget.files===null)return n(i?[]:null);n(i?Array.from(e.currentTarget.files):e.currentTarget.files[0]||null)},ref:a(g,v),name:u,form:d,capture:m,...h}),r({onClick:y,..._})]})});l.displayName=`@mantine/core/FileButton`;export{l as t};