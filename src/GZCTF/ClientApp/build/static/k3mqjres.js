/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T07:50:48.349Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{_ as e,i as t,y as n}from"./lz9snzk0.js";import{ft as r}from"./oa4z4ukh.js";import{T as i}from"./c2pke0fy.js";import{t as a}from"./iw8jfkp2.js";var o=n(),s=n=>{let{disabled:s,participation:c,setParticipation:l,size:u,...d}=n,f=i(),p=f.get(c.status),m=e(),{t:h}=r();return(0,o.jsx)(t,{wrap:`nowrap`,justify:`center`,mx:`xs`,miw:`calc(${m.spacing.xl} * 2)`,...d,children:p.transformTo.map(e=>{let t=f.get(e);return(0,o.jsx)(a,{size:u,iconPath:t.iconPath,color:t.color,message:h(`admin.content.games.review.participation.update`,{status:t.title}),disabled:s,onClick:()=>l(c.id,{status:e,divisionId:c.divisionId})},`${c.id}@${e}`)})})},c={root:`H_`,item:`I_`,label:`J_`,control:`K_`};export{s as n,c as t};