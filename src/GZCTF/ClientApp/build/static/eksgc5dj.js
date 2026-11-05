/* The GZ::CTF Project @unknown
 * 
 * License   : GNU Affero General Public License v3.0 (Core)
 * License   : LicenseRef-GZCTF-Restricted (Restricted components)
 * Commit    : Unofficial build version
 * Build     : 2026-11-05T08:27:05.203Z
 * Copyright (C) 2022-2026 GZTimeWalker. All Rights Reserved.
 */
import{L as e,Y as t,_ as n,i as r,y as i}from"./lz9snzk0.js";import{Ot as a}from"./n1rbp2ru.js";import{M as o}from"./lpohnctw.js";var s={bar:`qa`,pulse:`ra`,box:`sa`,back:`ta`,spikes:`ua`,spike:`va`,l:`wa`,r:`xa`,t:`ya`,b:`za`},c=i(),l=i=>{let{thickness:l=4,spikeLength:u=250,percentage:d,color:f,...p}=i,m=n(),{colorScheme:h}=o(),g=d<100,_=g?h===`dark`?`light`:f??m.primaryColor:`gray`,v=m.colors[_][5],y=m.colors[_][2];return(0,c.jsx)(a,{py:l*u/100,...p,__vars:{"--thickness":t(l),"--spike-length":`${u}%`,"--neg-spike-length":`${-u}%`,"--percentage":`${d}%`,"--spike-color":v,"--bg-color":y,"--pulsing-display":g?`block`:`none`},children:(0,c.jsx)(`div`,{className:s.back,children:(0,c.jsxs)(r,{justify:`right`,className:s.box,children:[(0,c.jsx)(`div`,{className:s.bar,children:(0,c.jsx)(`div`,{})}),(0,c.jsxs)(`div`,{className:s.spikes,children:[(0,c.jsx)(`div`,{className:e(s.spike,s.r)}),(0,c.jsx)(`div`,{className:e(s.spike,s.l)}),(0,c.jsx)(`div`,{className:e(s.spike,s.t)}),(0,c.jsx)(`div`,{className:e(s.spike,s.b)})]})]})})})};export{l as t};