/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{Y as e,c as t,h as n,it as r,y as i}from"./dn2mmff4.js";import{I as a,P as o}from"./d65mgsbd.js";var s=r(e(),1),c=i(),l=t(e=>{let{onChange:t,children:r,multiple:i,accept:l,name:u,form:d,resetRef:f,disabled:p,capture:m,inputProps:h,ref:g,..._}=n(`FileButton`,null,e),v=(0,s.useRef)(null),y=()=>{!p&&v.current?.click()};return o(f,()=>{v.current&&(v.current.value=``)}),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`input`,{style:{display:`none`},type:`file`,accept:l,multiple:i,onChange:e=>{if(e.currentTarget.files===null)return t(i?[]:null);t(i?Array.from(e.currentTarget.files):e.currentTarget.files[0]||null)},ref:a(g,v),name:u,form:d,capture:m,...h}),r({onClick:y,..._})]})});l.displayName=`@mantine/core/FileButton`;export{l as t};