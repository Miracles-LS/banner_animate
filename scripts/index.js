window.onload=function(){

    $('html,body').scrollTop(0);
    if($('html,body').scrollTop()<=0){
        $('html,body').addClass('overHidden');
    }

    let screenWidth = $(window).width();
    let screenHeight = $(window).height();
    let bannerHeight = $('.banner img').height();
    $('.banner').css({ 'width': screenWidth});

    let $body=document.querySelector('body');
    let $Banner = $('.banner');
    let $container = $('.container');

    let pagePosition = '';
    let isTouchStart;
    let startX = 0, startY = 0;  //滑屏起始x，y值

    function touchStart(e) {
        if ($(window).scrollTop() <= 0) {
            pagePosition = 'top';
            e.preventDefault();
            e.stopPropagation();
        }
        if (pagePosition) {
            isTouchStart =  true;
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
        }
    }
    function touchMove(e) {
        if (isTouchStart) {
            //避免横向滑屏影响
            let dDis = Math.abs(e.touches[0].pageX - startX) - Math.abs(e.touches[0].pageY - startY);
            if (dDis > 0) return false; //横向滑屏时阻止事件
            let touchScaleY = e.changedTouches[0].pageY - startY; //手指触摸滑动的距离
            if(pagePosition == 'top'){
                //确认页面在顶部，可以触发banner图变大
                if(touchScaleY > 0){
                    e.preventDefault();                    
                    let changeScale = touchScaleY / screenHeight;
                    if (changeScale >= 1.5) { changeScale = 1.5 }
                    $Banner.removeClass('scaleSmall');
                    $container.removeClass('noTranslateY');
                    $Banner.css({ 'transform': 'scale(' + (1 + changeScale) + ')' });
                    $container.css('transform', 'translateY(' + (bannerHeight * changeScale) + 'px)')
                }
                //当页面置顶想往下滑页面时
                else if(touchScaleY<0){
                    $('html,body').removeClass('overHidden');
                    $('html,body').addClass('scrollY');
                    $('html,body').scroll();
                }
            }
            scrollFun(e,touchScaleY);
        }
    }
    function touchEnd(e) {
        let touchScaleY = e.changedTouches[0].pageY - startY; // >0 往下拉   <0 往上滑 
        if (isTouchStart) {
            $Banner.addClass('scaleSmall');
            $container.addClass('noTranslateY');

            if(touchScaleY<0 && pagePosition =='top'){                
                pagePosition = 'noTop';
                $('html,body').animate({scrollTop:Math.abs(touchScaleY)},250);
            }
            scrollFun(e,touchScaleY);
            isTouchStart = false;
        }
    }

    //页面快接近顶部的时候让页面置顶
    function scrollFun(e,touchScaleY){
        if(touchScaleY>0 && $(window).scrollTop() <= (bannerHeight/2)){
            e.preventDefault();
            $('html,body').animate({scrollTop:0},0);
            $('html,body').addClass('overHidden');
            $('html,body').removeClass('scrollY');
            pagePosition = 'top';
        }
    }
    $body.addEventListener('touchstart', touchStart)
    $body.addEventListener('touchmove', touchMove)
    $body.addEventListener('touchend', touchEnd)
}