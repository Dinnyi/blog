/**
 * Created by LYH on 2016/11/1.
 */

window.addEventListener('load',function () {

    //通过class名获取元素
    function getByClass(oParent, sClass) {
        var aEle=oParent.getElementsByTagName('*');
        var aResult=[];
        var reg=new RegExp('\\b'+sClass+'\\b', 'i');
        var i=0;

        for(i=0;i<aEle.length;i++) {
            if(reg.test(aEle[i].className)) {
                aResult.push(aEle[i]);
            }
        }

        return aResult;
    }
    //绑定事件的兼容写法
    function myAddEvent(obj,sEvent,fn) {
        if(obj.attachEvent){
            obj.attachEvent('on'+sEvent,fn)
        }else{
            obj.addEventListener(sEvent,fn,false)
        }
    }
    //获取计算后的样式值
    function getStyle(obj,attr) {
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }else{
            return getComputedStyle(obj,false)[attr];
        }
    }
    //判断系统滚动条方向
    var beforeScrollTop=0;
    var afterScrollTop=0;
    var bDown=true;
    function scrollDirection() {
        afterScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        //大于0为下 反之为上
        bDown=afterScrollTop-beforeScrollTop > 0;
        if(bDown){}else{}
        //最后把当前的滚动位置赋值给beforeScrollTop 以便下次判断
        beforeScrollTop=afterScrollTop;
    }
    //完美运动框架
    function perfectMove(obj,json,fn) {

        clearInterval(obj.timer);

        obj.timer=setInterval(function () {
            var iCur=0;
            var bStop=true; //这一次运动就结束了 --- 所有的样式到达了预定的值
            for(var attr in json){
                //获取当前值
                if(attr=='opacity'){
                    iCur=Math.round(getStyle(obj,attr)*100);
                }else{
                    iCur=parseInt(getStyle(obj,attr));
                }
                //计算速度
                var iSpeed=(json[attr]-iCur)/9;
                iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
                //console.log(iSpeed);

                //样式变化 判断bStop为false
                if(iCur!=json[attr]){
                    bStop=false;
                }

                if(attr=='opacity'){
                    obj.style.filter='alpha(opacity='+(iCur+iSpeed)+')';
                    obj.style.opacity=(iCur+iSpeed)/100;
                }else{
                    obj.style[attr]=iCur+iSpeed+'px';
                }
            }

            //判断停止条件 写在 for...in 外部
            if(bStop){
                clearInterval(obj.timer);
                //判断第四个参数是否存在；如果存在，再执行程序；以免报错
                if(fn){
                    fn();
                }
            }
        },15)

    }



    //返回顶部
    var oBackTop=document.getElementById('backTop');
    function backTop(obj) {
        var oHtml=document.documentElement;
        var oBody=document.body;
        var scrollTop=0;
        var open1=true;
        var open2=false;
        var bScr=true;
        var timer=null;
        var timer2=null;
        var iSpeed=0;

        document.addEventListener('scroll',backTopMove,false);
        window.addEventListener('resize',backTopMove,false);

        function backTopMove() {

            scrollTop=oBody.scrollTop || oHtml.scrollTop;

            //判断用户主动拖动滚动条
            if(!bScr){
                clearInterval(timer2);
                obj.style.bottom='68px';
            }
            bScr=false;

            if(scrollTop >= oHtml.clientHeight){
                obj.style.display='block';
                if(open1){
                    open1=false;
                    open2=true;
                    timer=setTimeout(function () {
                        obj.style.opacity=1;
                        obj.style.filter='Alpha(opacity=100)';
                        clearTimeout(timer);
                    });
                }
            }else{
                obj.style.opacity=0;
                obj.style.filter='Alpha(opacity=0)';
                if(open2){
                    open1=true;
                    open2=false;
                    timer=setTimeout(function () {
                        obj.style.display='none';
                        clearTimeout(timer);
                    },500)
                }
            }
        }

        obj.addEventListener('click',function () {

            this.style.bottom='9999px';

            timer2=setInterval(function () {
                bScr=true;
                if(scrollTop==0){
                    clearInterval(timer2);
                }
                iSpeed=-scrollTop/8;
                iSpeed=Math.floor(iSpeed);
                oHtml.scrollTop=oBody.scrollTop=scrollTop+iSpeed;
            },30);

        },false)
    }
    backTop(oBackTop);



    //banner 相对位移
    var oBan=document.getElementById('ban');
    var oW=getByClass(oBan,'welcome')[0];
    var oMyInfo=getByClass(oBan,'my-info')[0];
    var oMyIntro=getByClass(oBan,'my-intro')[0];
    function banMove(obj) {
        var oHtml=document.documentElement;
        var oBody=document.body;
        var ScrollTop=0;
        var iSpeed=0;

        obj.style.height=oHtml.clientHeight+'px';
        oW.style.height=oHtml.clientHeight+'px';
        oMyInfo.style.marginTop=(oW.offsetHeight-oMyInfo.offsetHeight-parseInt(getStyle(oW,'paddingTop')))/2+'px';
        oMyIntro.style.marginTop=(oW.offsetHeight-oMyIntro.offsetHeight-parseInt(getStyle(oW,'paddingTop')))/2+'px';

        document.addEventListener('scroll',imgMove,false);
        window.addEventListener('resize',imgMove,false);

        function imgMove() {

            obj.style.height=oHtml.clientHeight+'px';
            oW.style.height=oHtml.clientHeight+'px';
            oMyInfo.style.marginTop=(oW.offsetHeight-oMyInfo.offsetHeight-parseInt(getStyle(oW,'paddingTop')))/2+'px';
            oMyIntro.style.marginTop=(oW.offsetHeight-oMyIntro.offsetHeight-parseInt(getStyle(oW,'paddingTop')))/2+'px';

            ScrollTop = oBody.scrollTop || oHtml.scrollTop;

            iSpeed=-ScrollTop/3.3;

            iSpeed=Math.floor(iSpeed);

            obj.style.backgroundPositionY=iSpeed+'px';

        }

    }
    banMove(oBan);



    //文章的显示与隐藏
    var oArtWarp=document.getElementById('artWarp');
    var aArtBox=getByClass(oArtWarp,'article-box');
    var i=0;
    for (i=0;i<aArtBox.length;i++){

        aArtBox[i].index=i;
        aArtBox[i].bOpen=true;
        var oArtTime=getByClass(aArtBox[i],'art-time')[0];
        var oArtBtnGroup=getByClass(aArtBox[i],'art-btn-group')[0];
        var oArtBtn=getByClass(oArtBtnGroup,'btn-toggle')[0];

        oArtTime.addEventListener('click',function () {

            var oArtCon=getByClass(this.parentNode,'art-content')[0];
            var oArtFoot=getByClass(this.parentNode,'art-foot')[0];
            var oArtBtnGroup=getByClass(this.parentNode,'art-btn-group')[0];
            var oArtBtn=getByClass(oArtBtnGroup,'btn-toggle')[0];

            if(this.parentNode.bOpen){
                this.parentNode.bOpen=false;
                oArtCon.style.display='none';
                oArtFoot.style.display='none';
                oArtBtn.innerHTML='显示全文';
            }else{
                this.parentNode.bOpen=true;
                oArtCon.style.display='block';
                oArtFoot.style.display='block';
                oArtBtn.innerHTML='隐藏全文';
            }
        },false);

        oArtBtn.addEventListener('click',function () {

            var oArtCon=getByClass(this.parentNode.parentNode,'art-content')[0];
            var oArtFoot=getByClass(this.parentNode.parentNode,'art-foot')[0];

            if(this.parentNode.parentNode.bOpen){
                this.parentNode.parentNode.bOpen=false;
                oArtCon.style.display='none';
                oArtFoot.style.display='none';
                this.innerHTML='显示全文';
            }else{
                this.parentNode.parentNode.bOpen=true;
                oArtCon.style.display='block';
                oArtFoot.style.display='block';
                this.innerHTML='隐藏全文';
            }
        },false)

    }



    //登录弹出层的显示隐藏
    var oLogin=document.getElementById('login');
    var oMask=document.getElementById('mask');
    var oLoginBox=document.getElementById('login-box');
    var oLoginClose=getByClass(oLoginBox,'login-close')[0];
    oLogin.bOpen=false;
    oLogin.addEventListener('click',function () {
        if(this.bOpen){
            oLogin.bOpen=false;
            oMask.style.display='none';
            oLoginBox.style.display='none';
        }else{
            oLogin.bOpen=true;
            oMask.style.display='block';
            oLoginBox.style.display='block';
        }
        oLoginClose.addEventListener('click',function () {
            oLogin.bOpen=false;
            oMask.style.display='none';
            oLoginBox.style.display='none';
        },false);
    },false);



    //二级导航
    var oNav=document.getElementById('nav');
    var aList=getByClass(oNav,'list');
    var j=0;
    for(j=0;j<aList.length;j++){

        aList[j].onmouseover=function () {
            var oUl=this.getElementsByTagName('ul')[0];
            var oA=this.getElementsByTagName('a')[0];
            if(oUl){

                if(this.timer){
                    clearTimeout(this.timer);
                    this.timer=null;
                    return;
                }
                oA.onmouseover=oUl.onmouseover=function (ev){
                    if(this.parentNode.timer){
                        clearTimeout(this.parentNode.timer);
                        this.parentNode.timer=null;
                        (ev||event).cancelBubble=true;
                    }
                };
                oA.onmouseout=oUl.onmouseout=function (ev){
                    var oParent=this.parentNode;
                    if(oParent.timer){
                        clearTimeout(oParent.timer);
                        oParent.timer=null;
                    }
                    oParent.onmouseout();
                    (ev||event).cancelBubble=true;
                };


                // for(k=0;k<aList.length;k++){
                //     aList[k].children[0].className='';
                // }
                oA.style.background='#b90024';
                //获取高度
                oUl.style.display='block';
                oUl.style.height='auto';
                var iHeight=oUl.offsetHeight;
                oUl.style.height=0;
                perfectMove(oUl,{height:iHeight,opacity:100});

            }
        };

        aList[j].onmouseout=function () {
            var oUl=this.getElementsByTagName('ul')[0];
            var oA=this.getElementsByTagName('a')[0];
            var _this=this;
            if(oUl){
                this.timer=setTimeout(function () {
                    perfectMove(oUl,{height:0,opacity:0});
                    oA.style.background='';
                    clearTimeout(_this.timer);
                    _this.timer=null;
                },200);
            }
        };

    }

},false);
