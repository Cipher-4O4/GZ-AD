/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T08:55:19.444Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{nt as e,q as t,y as n}from"./lz9snzk0.js";import{Ot as r,V as i,y as a,z as o}from"./n1rbp2ru.js";import{i as s}from"./cxpcvy8f.js";import{Yn as c}from"./i1ss6tt2.js";var l=e(t(),1),u=n(),d=new Map([[a.Admin,3],[a.Monitor,1],[a.User,0],[a.Banned,-1]]),f=(e,t)=>d.get(t??a.User)>=d.get(e),p=({requiredRole:e,children:t})=>{let{role:n,error:a}=s(),f=i(),p=o(),m=d.get(e);return(0,l.useEffect)(()=>{a&&a.status===401&&f(`/account/login?from=${p.pathname}`,{replace:!0}),n&&d.get(n)<m&&f(`/404`)},[n,a,m,f]),n&&d.get(n)<m?(0,u.jsx)(r,{h:`calc(100vh - 32px)`,children:(0,u.jsx)(c,{})}):(0,u.jsx)(u.Fragment,{children:t})};export{p as n,f as t};