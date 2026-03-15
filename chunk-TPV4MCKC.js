import{Sa as c,Za as N,ib as P,jb as B,mb as a,s as p}from"./chunk-EYHLEGFQ.js";import{Ab as D,Bb as M,Cb as n,Db as t,Pa as v,Q as g,R as h,T as y,V as d,Zb as w,aa as S,ac as l,bb as m,bc as e,cb as x,fb as b,gb as k,kc as I,ob as E,qa as u,yb as f,zb as C}from"./chunk-HEIM2PR4.js";var T=class i{static \u0275fac=function(r){return new(r||i)};static \u0275cmp=m({type:i,selectors:[["app-documentation"]],decls:68,vars:0,consts:[[1,"card"],[1,"font-semibold","text-2xl","mb-4"],[1,"font-semibold","text-xl","mb-4"],[1,"text-lg","mb-4"],[1,"app-code"],[1,"bg-highlight","px-2","py-1","rounded-border","not-italic","text-base"],[1,"leading-normal","list-disc","pl-8","text-lg","mb-4"],[1,"text-primary","font-medium"]],template:function(r,s){r&1&&(n(0,"div",0)(1,"div",1),e(2,"Documentation"),t(),n(3,"div",2),e(4,"Get Started"),t(),n(5,"p",3),e(6,"Sakai is an application template for Angular and is distributed as a CLI project. Current versions are Angular v21 with PrimeNG v21. In case CLI is not installed already, use the command below to set it up."),t(),n(7,"pre",4)(8,"code"),e(9,"npm install -g @angular/cli"),t()(),n(10,"p",3),e(11,' Once CLI is ready in your system, extract the contents of the zip file distribution, cd to the directory, install the libraries from npm and then execute "ng serve" to run the application in your local environment. '),t(),n(12,"pre",4)(13,"code"),e(14,`git clone https://github.com/primefaces/sakai-ng
npm install
ng serve`),t()(),n(15,"p",3),e(16,"The application should run at "),n(17,"i",5),e(18,"http://localhost:4200/"),t(),e(19," to view the application in your local environment."),t(),n(20,"div",2),e(21,"Structure"),t(),n(22,"p",3),e(23,"Templates consists of a couple folders, demos and layout have been separated so that you can easily identify what is necessary for your application."),t(),n(24,"ul",6)(25,"li")(26,"span",7),e(27,"src/app/layout"),t(),e(28,": Main layout files, needs to be present."),t(),n(29,"li")(30,"span",7),e(31,"src/app/pages"),t(),e(32,": Demo content like Dashboard."),t(),n(33,"li")(34,"span",7),e(35,"src/assets/demo"),t(),e(36,": Assets used in demos"),t(),n(37,"li")(38,"span",7),e(39,"src/assets/layout"),t(),e(40,": SCSS files of the main layout"),t()(),n(41,"div",2),e(42,"Menu"),t(),n(43,"p",3),e(44," Main menu is defined at "),n(45,"span",5),e(46,"src/app/layout/component/app.menu.ts"),t(),e(47," file. Update the "),n(48,"i",5),e(49,"model"),t(),e(50," property to define your own menu items. "),t(),n(51,"div",2),e(52,"Layout Service"),t(),n(53,"p",3)(54,"span",5),e(55,"src/app/layout/service/layout.service.ts"),t(),e(56," is a service that manages layout state changes, including dark mode, PrimeNG theme, menu modes, and states. "),t(),n(57,"div",2),e(58,"Tailwind CSS"),t(),n(59,"p",3),e(60,"The demo pages are developed with Tailwind CSS however the core application shell uses custom CSS."),t(),n(61,"div",2),e(62,"Variables"),t(),n(63,"p",3),e(64," CSS variables used in the template are derived from the applied PrimeNG theme. Customize them through the CSS variables in "),n(65,"span",5),e(66,"src/assets/layout/variables"),t(),e(67,". "),t()())},dependencies:[p],styles:["@media screen and (max-width:991px){.video-container[_ngcontent-%COMP%]{position:relative;width:100%;height:0;padding-bottom:56.25%}.video-container[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%}}"]})};var F=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`;var O={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},A=(()=>{class i extends N{name="progressspinner";style=F;classes=O;static \u0275fac=(()=>{let r;return function(o){return(r||(r=u(i)))(o||i)}})();static \u0275prov=g({token:i,factory:i.\u0275fac})}return i})();var L=new y("PROGRESSSPINNER_INSTANCE"),R=(()=>{class i extends B{$pcProgressSpinner=d(L,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=d(a,{self:!0});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}_componentStyle=d(A);static \u0275fac=(()=>{let r;return function(o){return(r||(r=u(i)))(o||i)}})();static \u0275cmp=m({type:i,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(s,o){s&2&&(E("aria-label",o.ariaLabel)("role","progressbar")("aria-busy",!0),l(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[I([A,{provide:L,useExisting:i},{provide:P,useExisting:i}]),b([a]),k],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(s,o){s&1&&(S(),C(0,"svg",0),M(1,"circle",1),D()),s&2&&(l(o.cx("spin")),w("animation-duration",o.animationDuration),f("pBind",o.ptm("spin")),v(),l(o.cx("circle")),f("pBind",o.ptm("circle")),E("fill",o.fill)("stroke-width",o.strokeWidth))},dependencies:[p,c,a],encapsulation:2,changeDetection:0})}return i})(),oe=(()=>{class i{static \u0275fac=function(s){return new(s||i)};static \u0275mod=x({type:i});static \u0275inj=h({imports:[R,c,c]})}return i})();export{T as a,R as b,oe as c};
