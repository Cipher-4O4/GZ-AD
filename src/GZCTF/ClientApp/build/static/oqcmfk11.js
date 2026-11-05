/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T06:35:58.142Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{Y as e,it as t,y as n}from"./dn2mmff4.js";import{i as r}from"./dwedphml.js";import{Bn as i}from"./flou4uvr.js";import{Ot as a,V as o,y as s,z as c}from"./nycdw5fb.js";var l=t(e(),1),u=n(),d=new Map([[s.Admin,3],[s.Monitor,1],[s.User,0],[s.Banned,-1]]),f=(e,t)=>d.get(t??s.User)>=d.get(e),p=({requiredRole:e,children:t})=>{let{role:n,error:s}=r(),f=o(),p=c(),m=d.get(e);return(0,l.useEffect)(()=>{s&&s.status===401&&f(`/account/login?from=${p.pathname}`,{replace:!0}),n&&d.get(n)<m&&f(`/404`)},[n,s,m,f]),n&&d.get(n)<m?(0,u.jsx)(a,{h:`calc(100vh - 32px)`,children:(0,u.jsx)(i,{})}):(0,u.jsx)(u.Fragment,{children:t})};export{p as n,f as t};