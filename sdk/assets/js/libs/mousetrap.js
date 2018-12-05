/*!
* mousetrap - https://craig.is/killing/mice - A simple library for handling keyboard shortcuts in Javascript
* 
*                               Apache License
*                         Version 2.0, January 2004
*                      http://www.apache.org/licenses/
* 
* TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
* 
* 1. Definitions.
* 
*    "License" shall mean the terms and conditions for use, reproduction,
*    and distribution as defined by Sections 1 through 9 of this document.
* 
*    "Licensor" shall mean the copyright owner or entity authorized by
*    the copyright owner that is granting the License.
* 
*    "Legal Entity" shall mean the union of the acting entity and all
*    other entities that control, are controlled by, or are under common
*    control with that entity. For the purposes of this definition,
*    "control" means (i) the power, direct or indirect, to cause the
*    direction or management of such entity, whether by contract or
*    otherwise, or (ii) ownership of fifty percent (50%) or more of the
*    outstanding shares, or (iii) beneficial ownership of such entity.
* 
*    "You" (or "Your") shall mean an individual or Legal Entity
*    exercising permissions granted by this License.
* 
*    "Source" form shall mean the preferred form for making modifications,
*    including but not limited to software source code, documentation
*    source, and configuration files.
* 
*    "Object" form shall mean any form resulting from mechanical
*    transformation or translation of a Source form, including but
*    not limited to compiled object code, generated documentation,
*    and conversions to other media types.
* 
*    "Work" shall mean the work of authorship, whether in Source or
*    Object form, made available under the License, as indicated by a
*    copyright notice that is included in or attached to the work
*    (an example is provided in the Appendix below).
* 
*    "Derivative Works" shall mean any work, whether in Source or Object
*    form, that is based on (or derived from) the Work and for which the
*    editorial revisions, annotations, elaborations, or other modifications
*    represent, as a whole, an original work of authorship. For the purposes
*    of this License, Derivative Works shall not include works that remain
*    separable from, or merely link (or bind by name) to the interfaces of,
*    the Work and Derivative Works thereof.
* 
*    "Contribution" shall mean any work of authorship, including
*    the original version of the Work and any modifications or additions
*    to that Work or Derivative Works thereof, that is intentionally
*    submitted to Licensor for inclusion in the Work by the copyright owner
*    or by an individual or Legal Entity authorized to submit on behalf of
*    the copyright owner. For the purposes of this definition, "submitted"
*    means any form of electronic, verbal, or written communication sent
*    to the Licensor or its representatives, including but not limited to
*    communication on electronic mailing lists, source code control systems,
*    and issue tracking systems that are managed by, or on behalf of, the
*    Licensor for the purpose of discussing and improving the Work, but
*    excluding communication that is conspicuously marked or otherwise
*    designated in writing by the copyright owner as "Not a Contribution."
* 
*    "Contributor" shall mean Licensor and any individual or Legal Entity
*    on behalf of whom a Contribution has been received by Licensor and
*    subsequently incorporated within the Work.
* 
* 2. Grant of Copyright License. Subject to the terms and conditions of
*    this License, each Contributor hereby grants to You a perpetual,
*    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
*    copyright license to reproduce, prepare Derivative Works of,
*    publicly display, publicly perform, sublicense, and distribute the
*    Work and such Derivative Works in Source or Object form.
* 
* 3. Grant of Patent License. Subject to the terms and conditions of
*    this License, each Contributor hereby grants to You a perpetual,
*    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
*    (except as stated in this section) patent license to make, have made,
*    use, offer to sell, sell, import, and otherwise transfer the Work,
*    where such license applies only to those patent claims licensable
*    by such Contributor that are necessarily infringed by their
*    Contribution(s) alone or by combination of their Contribution(s)
*    with the Work to which such Contribution(s) was submitted. If You
*    institute patent litigation against any entity (including a
*    cross-claim or counterclaim in a lawsuit) alleging that the Work
*    or a Contribution incorporated within the Work constitutes direct
*    or contributory patent infringement, then any patent licenses
*    granted to You under this License for that Work shall terminate
*    as of the date such litigation is filed.
* 
* 4. Redistribution. You may reproduce and distribute copies of the
*    Work or Derivative Works thereof in any medium, with or without
*    modifications, and in Source or Object form, provided that You
*    meet the following conditions:
* 
*    (a) You must give any other recipients of the Work or
*        Derivative Works a copy of this License; and
* 
*    (b) You must cause any modified files to carry prominent notices
*        stating that You changed the files; and
* 
*    (c) You must retain, in the Source form of any Derivative Works
*        that You distribute, all copyright, patent, trademark, and
*        attribution notices from the Source form of the Work,
*        excluding those notices that do not pertain to any part of
*        the Derivative Works; and
* 
*    (d) If the Work includes a "NOTICE" text file as part of its
*        distribution, then any Derivative Works that You distribute must
*        include a readable copy of the attribution notices contained
*        within such NOTICE file, excluding those notices that do not
*        pertain to any part of the Derivative Works, in at least one
*        of the following places: within a NOTICE text file distributed
*        as part of the Derivative Works; within the Source form or
*        documentation, if provided along with the Derivative Works; or,
*        within a display generated by the Derivative Works, if and
*        wherever such third-party notices normally appear. The contents
*        of the NOTICE file are for informational purposes only and
*        do not modify the License. You may add Your own attribution
*        notices within Derivative Works that You distribute, alongside
*        or as an addendum to the NOTICE text from the Work, provided
*        that such additional attribution notices cannot be construed
*        as modifying the License.
* 
*    You may add Your own copyright statement to Your modifications and
*    may provide additional or different license terms and conditions
*    for use, reproduction, or distribution of Your modifications, or
*    for any such Derivative Works as a whole, provided Your use,
*    reproduction, and distribution of the Work otherwise complies with
*    the conditions stated in this License.
* 
* 5. Submission of Contributions. Unless You explicitly state otherwise,
*    any Contribution intentionally submitted for inclusion in the Work
*    by You to the Licensor shall be under the terms and conditions of
*    this License, without any additional terms or conditions.
*    Notwithstanding the above, nothing herein shall supersede or modify
*    the terms of any separate license agreement you may have executed
*    with Licensor regarding such Contributions.
* 
* 6. Trademarks. This License does not grant permission to use the trade
*    names, trademarks, service marks, or product names of the Licensor,
*    except as required for reasonable and customary use in describing the
*    origin of the Work and reproducing the content of the NOTICE file.
* 
* 7. Disclaimer of Warranty. Unless required by applicable law or
*    agreed to in writing, Licensor provides the Work (and each
*    Contributor provides its Contributions) on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
*    implied, including, without limitation, any warranties or conditions
*    of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
*    PARTICULAR PURPOSE. You are solely responsible for determining the
*    appropriateness of using or redistributing the Work and assume any
*    risks associated with Your exercise of permissions under this License.
* 
* 8. Limitation of Liability. In no event and under no legal theory,
*    whether in tort (including negligence), contract, or otherwise,
*    unless required by applicable law (such as deliberate and grossly
*    negligent acts) or agreed to in writing, shall any Contributor be
*    liable to You for damages, including any direct, indirect, special,
*    incidental, or consequential damages of any character arising as a
*    result of this License or out of the use or inability to use the
*    Work (including but not limited to damages for loss of goodwill,
*    work stoppage, computer failure or malfunction, or any and all
*    other commercial damages or losses), even if such Contributor
*    has been advised of the possibility of such damages.
* 
* 9. Accepting Warranty or Additional Liability. While redistributing
*    the Work or Derivative Works thereof, You may choose to offer,
*    and charge a fee for, acceptance of support, warranty, indemnity,
*    or other liability obligations and/or rights consistent with this
*    License. However, in accepting such obligations, You may act only
*    on Your own behalf and on Your sole responsibility, not on behalf
*    of any other Contributor, and only if You agree to indemnify,
*    defend, and hold each Contributor harmless for any liability
*    incurred by, or claims asserted against, such Contributor by reason
*    of your accepting any such warranty or additional liability.
* 
* END OF TERMS AND CONDITIONS
* 
* --- Exceptions to the Apache 2.0 License ----
* 
* As an exception, if, as a result of your compiling your source code, portions
* of this Software are embedded into an Object form of such source code, you
* may redistribute such embedded portions in such Object form without complying
* with the conditions of Sections 4(a), 4(b) and 4(d) of the License.
* 
* In addition, if you combine or link compiled forms of this Software with
* software that is licensed under the GPLv2 ("Combined Software") and if a
* court of competent jurisdiction determines that the patent provision (Section
* 3), the indemnity provision (Section 9) or other Section of the License
* conflicts with the conditions of the GPLv2, you may retroactively and
* prospectively choose to deem waived or otherwise exclude such Section(s) of
* the License, but only in their entirety and only with respect to the Combined
* Software.
*/
!function(e,r,t){if(e){for(var i,o={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},n={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},c={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},s={option:"alt",command:"meta",return:"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},a=1;a<20;++a)o[111+a]="f"+a;for(a=0;a<=9;++a)o[a+96]=a.toString();_.prototype.bind=function(e,t,n){return e=e instanceof Array?e:[e],this._bindMultiple.call(this,e,t,n),this},_.prototype.unbind=function(e,t){return this.bind.call(this,e,function(){},t)},_.prototype.trigger=function(e,t){return this._directMap[e+":"+t]&&this._directMap[e+":"+t]({},e),this},_.prototype.reset=function(){return this._callbacks={},this._directMap={},this},_.prototype.stopCallback=function(e,t){return!(-1<(" "+t.className+" ").indexOf(" mousetrap "))&&(!function e(t,n){return null!==t&&t!==r&&(t===n||e(t.parentNode,n))}(t,this.target)&&("INPUT"==t.tagName||"SELECT"==t.tagName||"TEXTAREA"==t.tagName||t.isContentEditable))},_.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)},_.addKeycodes=function(e){for(var t in e)e.hasOwnProperty(t)&&(o[t]=e[t]);i=null},_.init=function(){var t=_(r);for(var e in t)"_"!==e.charAt(0)&&(_[e]=function(e){return function(){return t[e].apply(t,arguments)}}(e))},_.init(),e.Mousetrap=_,"undefined"!=typeof module&&module.exports&&(module.exports=_),"function"==typeof define&&define.amd&&define(function(){return _})}function v(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)}function b(e){if("keypress"!=e.type)return o[e.which]?o[e.which]:n[e.which]?n[e.which]:String.fromCharCode(e.which).toLowerCase();var t=String.fromCharCode(e.which);return e.shiftKey||(t=t.toLowerCase()),t}function g(e){return"shift"==e||"ctrl"==e||"alt"==e||"meta"==e}function l(e,t,n){return n||(n=function(){if(!i)for(var e in i={},o)95<e&&e<112||o.hasOwnProperty(e)&&(i[o[e]]=e);return i}()[e]?"keydown":"keypress"),"keypress"==n&&t.length&&(n="keydown"),n}function w(e,t){var n,r,i,o,a=[];for(n="+"===(o=e)?["+"]:(o=o.replace(/\+{2}/g,"+plus")).split("+"),i=0;i<n.length;++i)r=n[i],s[r]&&(r=s[r]),t&&"keypress"!=t&&c[r]&&(r=c[r],a.push("shift")),g(r)&&a.push(r);return{key:r,modifiers:a,action:t=l(r,a,t)}}function _(e){var d=this;if(e=e||r,!(d instanceof _))return new _(e);d.target=e,d._callbacks={},d._directMap={};var s,y={},l=!1,u=!1,f=!1;function p(e){e=e||{};var t,n=!1;for(t in y)e[t]?n=!0:y[t]=0;n||(f=!1)}function h(e,t,n,r,i,o){var a,c,s,l,u=[],f=n.type;if(!d._callbacks[e])return[];for("keyup"==f&&g(e)&&(t=[e]),a=0;a<d._callbacks[e].length;++a)if(c=d._callbacks[e][a],(r||!c.seq||y[c.seq]==c.level)&&f==c.action&&("keypress"==f&&!n.metaKey&&!n.ctrlKey||(s=t,l=c.modifiers,s.sort().join(",")===l.sort().join(",")))){var p=!r&&c.combo==i,h=r&&c.seq==r&&c.level==o;(p||h)&&d._callbacks[e].splice(a,1),u.push(c)}return u}function m(e,t,n,r){var i,o;d.stopCallback(t,t.target||t.srcElement,n,r)||!1===e(t,n)&&((o=t).preventDefault?o.preventDefault():o.returnValue=!1,(i=t).stopPropagation?i.stopPropagation():i.cancelBubble=!0)}function t(e){"number"!=typeof e.which&&(e.which=e.keyCode);var t,n,r=b(e);r&&("keyup"!=e.type||l!==r?d.handleKey(r,(n=[],(t=e).shiftKey&&n.push("shift"),t.altKey&&n.push("alt"),t.ctrlKey&&n.push("ctrl"),t.metaKey&&n.push("meta"),n),e):l=!1)}function c(t,e,n,r){function i(e){return function(){f=e,++y[t],clearTimeout(s),s=setTimeout(p,1e3)}}function o(e){m(n,e,t),"keyup"!==r&&(l=b(e)),setTimeout(p,10)}for(var a=y[t]=0;a<e.length;++a){var c=a+1===e.length?o:i(r||w(e[a+1]).action);k(e[a],c,r,t,a)}}function k(e,t,n,r,i){d._directMap[e+":"+n]=t;var o,a=(e=e.replace(/\s+/g," ")).split(" ");1<a.length?c(e,a,t,n):(o=w(e,n),d._callbacks[o.key]=d._callbacks[o.key]||[],h(o.key,o.modifiers,{type:o.action},r,e,i),d._callbacks[o.key][r?"unshift":"push"]({callback:t,modifiers:o.modifiers,action:o.action,seq:r,level:i,combo:e}))}d._handleKey=function(e,t,n){var r,i=h(e,t,n),o={},a=0,c=!1;for(r=0;r<i.length;++r)i[r].seq&&(a=Math.max(a,i[r].level));for(r=0;r<i.length;++r)if(i[r].seq){if(i[r].level!=a)continue;c=!0,o[i[r].seq]=1,m(i[r].callback,n,i[r].combo,i[r].seq)}else c||m(i[r].callback,n,i[r].combo);var s="keypress"==n.type&&u;n.type!=f||g(e)||s||p(o),u=c&&"keydown"==n.type},d._bindMultiple=function(e,t,n){for(var r=0;r<e.length;++r)k(e[r],t,n)},v(e,"keypress",t),v(e,"keydown",t),v(e,"keyup",t)}}("undefined"!=typeof window?window:null,"undefined"!=typeof window?document:null);