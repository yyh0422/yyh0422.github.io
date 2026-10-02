// 移动端社交图标交互功能
(function() {
    // 检测是否为移动端（触摸设备 + 屏幕宽度小于768px）
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // 只有在移动端才执行此逻辑
    if (!isMobile || !isTouchDevice) {
        return;
    }
    
    const containers = document.querySelectorAll('.social-icon-container');
    const mobileHoverContainer = document.getElementById('mobile-hover-image-container');
    const mobileHoverImage = mobileHoverContainer ? mobileHoverContainer.querySelector('img') : null;
    const mobileHoverTip = document.getElementById('mobile-hover-tip');
    
    if (!mobileHoverContainer) {
        return;
    }
    
    // 存储当前显示状态的图标容器
    let activeContainer = null;
    // 提示自动隐藏定时器
    let tipTimeout = null;
    
    // 显示移动端悬停图片和提示
    function showMobileHoverImage(container) {
        const hoverImage = container.dataset.hoverImage;
        const url = container.dataset.url;
        const title = container.dataset.title;
        
        // 清除之前的定时器
        if (tipTimeout) {
            clearTimeout(tipTimeout);
            tipTimeout = null;
        }
        
        // 显示悬停图片（如果有）
        if (hoverImage && mobileHoverImage) {
            mobileHoverImage.src = hoverImage;
            mobileHoverImage.alt = title + ' hover image';
            mobileHoverImage.style.display = 'block';
        } else if (mobileHoverImage) {
            mobileHoverImage.style.display = 'none';
        }
        
        // 显示提示（只有当有URL时才显示）
        if (mobileHoverTip) {
            if (url) {
                mobileHoverTip.classList.add('active');
                // 1.5秒后自动隐藏提示
                tipTimeout = setTimeout(() => {
                    mobileHoverTip.classList.remove('active');
                }, 1500);
            } else {
                mobileHoverTip.classList.remove('active');
            }
        }
        
        mobileHoverContainer.classList.add('active');
        activeContainer = container;
        container.classList.add('hover-active');
    }
    
    // 隐藏移动端悬停图片和提示
    function hideMobileHoverImage() {
        // 清除提示定时器
        if (tipTimeout) {
            clearTimeout(tipTimeout);
            tipTimeout = null;
        }
        mobileHoverContainer.classList.remove('active');
        if (mobileHoverTip) {
            mobileHoverTip.classList.remove('active');
        }
        if (activeContainer) {
            activeContainer.classList.remove('hover-active');
            activeContainer = null;
        }
    }
    
    containers.forEach(container => {
        const url = container.dataset.url;
        const hoverImage = container.dataset.hoverImage;
        const link = container.querySelector('a');
        
        if (link) {
            // 有链接的图标
            link.addEventListener('click', (e) => {
                // 第一次点击：显示悬停图片和提示，阻止跳转
                if (activeContainer !== container) {
                    e.preventDefault();
                    e.stopPropagation();
                    hideMobileHoverImage();
                    showMobileHoverImage(container);
                }
                // 第二次点击：允许默认跳转行为
            });
        } else {
            // 没有链接的图标
            const span = container.querySelector('.social-icon-no-link');
            if (span) {
                span.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (activeContainer === container) {
                        // 如果当前已显示，则隐藏
                        hideMobileHoverImage();
                    } else {
                        // 否则显示（只显示悬停图片，不显示提示因为没有URL）
                        hideMobileHoverImage();
                        showMobileHoverImage(container);
                    }
                });
            }
        }
    });
    
    // 点击页面其他地方关闭悬停图片
    document.addEventListener('click', (e) => {
        if (activeContainer && !e.target.closest('.social-icon-container') && !e.target.closest('.mobile-hover-image-container')) {
            hideMobileHoverImage();
        }
    });
    
    // 点击移动端悬停图片容器本身关闭
    mobileHoverContainer.addEventListener('click', (e) => {
        if (e.target === mobileHoverContainer) {
            hideMobileHoverImage();
        }
    });
})();
