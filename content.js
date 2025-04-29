// 图片下载助手内容脚本

// 当前悬停的图片元素
let currentHoverImg = null;

// 创建下载按钮元素
function createDownloadButton() {
  const button = document.createElement('div');
  button.className = 'image-download-button';
  button.innerHTML = '下载';
  button.style.display = 'none';
  document.body.appendChild(button);
  
  // 检查是否在即梦网站上
  const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');
  
  // 为即梦网站设置特殊样式，防止闪烁
  if (isJimengSite) {
    // 增加按钮大小，使其更容易点击
    button.style.padding = '10px 15px';
    button.style.minWidth = '60px';
    button.style.minHeight = '30px';
    button.style.fontSize = '16px';
    // 确保按钮在最上层
    button.style.zIndex = '2147483647';
    // 确保按钮可以接收点击事件
    button.style.pointerEvents = 'auto';
  }
  
  // 防止事件冒泡导致的闪烁问题
  button.addEventListener('mouseenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    // 确保按钮在鼠标悬停时保持显示
    this.style.display = 'block';
    
    // 标记按钮正在被悬停
    button.dataset.hovering = 'true';
    
    if (isJimengSite) {
      // 在即梦网站上，增加额外的保护措施
      this.style.pointerEvents = 'auto';
      this.style.zIndex = '2147483647';
    }
  });
  
  button.addEventListener('mouseleave', function(e) {
    e.stopPropagation();
    
    // 移除悬停标记，但在即梦网站上延迟执行
    if (isJimengSite) {
      // 延迟移除悬停标记，给用户更多时间点击按钮
      setTimeout(() => {
        // 检查鼠标当前位置，如果仍在按钮附近，不要移除悬停标记
        const buttonRect = button.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const buffer = 30; // 更大的缓冲区
        
        if (mouseX >= buttonRect.left - buffer && mouseX <= buttonRect.right + buffer && 
            mouseY >= buttonRect.top - buffer && mouseY <= buttonRect.bottom + buffer) {
          // 鼠标仍在按钮附近，保持悬停状态
          return;
        }
        
        button.dataset.hovering = 'false';
        
        // 只有当鼠标不在图片上时才隐藏按钮
        if (!currentHoverImg) {
          this.style.display = 'none';
        }
      }, 500); // 增加延迟时间，给用户更多反应时间
    } else {
      // 豆包网站使用原来的逻辑
      button.dataset.hovering = 'false';
      
      // 只有当鼠标不在图片上时才隐藏按钮
      if (!currentHoverImg) {
        this.style.display = 'none';
      }
    }
  });
  
  return button;
}

// 初始化下载按钮
const downloadButton = createDownloadButton();

// 检查是否在即梦网站上
const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');

// 创建一个全局标志变量，用于跟踪按钮是否处于稳定状态
window.buttonStableMode = false;

// 针对即梦网站添加额外的事件处理
if (isJimengSite) {
  
  // 监听整个文档的鼠标移动事件，防止按钮意外消失
  document.addEventListener('mousemove', (event) => {
    // 如果按钮正在显示，确保它保持稳定
    if (downloadButton.style.display === 'block') {
      const buttonRect = downloadButton.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      // 检查鼠标是否在按钮附近
      const buffer = 40; // 更大的缓冲区，防止闪烁
      if (mouseX >= buttonRect.left - buffer && mouseX <= buttonRect.right + buffer && 
          mouseY >= buttonRect.top - buffer && mouseY <= buttonRect.bottom + buffer) {
        // 确保按钮保持显示
        downloadButton.style.display = 'block';
        downloadButton.dataset.hovering = 'true';
        
        // 如果鼠标非常接近按钮，进入稳定模式
        const innerBuffer = 20;
        if (mouseX >= buttonRect.left - innerBuffer && mouseX <= buttonRect.right + innerBuffer && 
            mouseY >= buttonRect.top - innerBuffer && mouseY <= buttonRect.bottom + innerBuffer) {
          buttonStableMode = true;
          // 在稳定模式下，增强按钮样式以提供视觉反馈
          downloadButton.style.transform = 'scale(1.05)';
          downloadButton.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.4)';
        }
      } else if (buttonStableMode) {
        // 如果处于稳定模式但鼠标已经远离，给予一定延迟后再退出稳定模式
        setTimeout(() => {
          buttonStableMode = false;
          downloadButton.style.transform = '';
          downloadButton.style.boxShadow = '';
          
          // 只有当鼠标不在图片上且不在悬停状态时才隐藏按钮
          if (!currentHoverImg && downloadButton.dataset.hovering !== 'true') {
            downloadButton.style.display = 'none';
          }
        }, 300);
      } else if (downloadButton.dataset.hovering === 'true' && !currentHoverImg) {
        // 如果鼠标已经远离按钮且不在图片上，重置悬停状态
        downloadButton.dataset.hovering = 'false';
      }
    }
  });
  
  // 添加鼠标按下事件监听，防止点击时按钮消失
  document.addEventListener('mousedown', (event) => {
    if (downloadButton.style.display === 'block') {
      const buttonRect = downloadButton.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      // 检查鼠标是否在按钮附近
      const buffer = 20;
      if (mouseX >= buttonRect.left - buffer && mouseX <= buttonRect.right + buffer && 
          mouseY >= buttonRect.top - buffer && mouseY <= buttonRect.bottom + buffer) {
        // 阻止事件传播，确保按钮可以被点击
        event.stopPropagation();
        window.buttonStableMode = true; // 进入稳定模式
      }
    }
  });
}

// 处理鼠标移入图片事件
function handleMouseEnter(event) {
  // 阻止事件冒泡
  event.stopPropagation();
  
  const img = event.target;
  currentHoverImg = img;
  
  // 获取图片位置信息
  const rect = img.getBoundingClientRect();
  
  // 检查是否在即梦网站上
  const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');
  
  // 根据网站调整按钮位置
  if (isJimengSite) {
    // 即梦网站上，将按钮放在更容易点击的位置
    downloadButton.style.top = `${window.scrollY + rect.top + 15}px`;
    downloadButton.style.left = `${window.scrollX + rect.left + 15}px`;
    // 增加z-index确保按钮在最上层
    downloadButton.style.zIndex = '2147483647';
  } else {
    // 豆包网站使用原来的位置
    downloadButton.style.top = `${window.scrollY + rect.top + 10}px`;
    downloadButton.style.left = `${window.scrollX + rect.left + 10}px`;
  }
  
  // 显示下载按钮
  downloadButton.style.display = 'block';
  
  // 设置当前图片URL
  downloadButton.dataset.imgSrc = img.src;
}

// 处理鼠标移出图片事件
function handleMouseLeave(event) {
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 检查是否在即梦网站上
  const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');
  
  // 在即梦网站上，延迟重置当前悬停图片，给用户更多时间移动到按钮上
  if (isJimengSite) {
    // 获取当前鼠标位置
    const currentMouseX = event.clientX;
    const currentMouseY = event.clientY;
    
    // 获取按钮位置
    const buttonRect = downloadButton.getBoundingClientRect();
    
    // 检查鼠标是否正在向按钮移动
    const movingTowardsButton = 
      currentMouseX >= buttonRect.left - 50 && currentMouseX <= buttonRect.right + 50 && 
      currentMouseY >= buttonRect.top - 50 && currentMouseY <= buttonRect.bottom + 50;
    
    // 如果鼠标正在向按钮移动，不要立即重置悬停图片
    if (movingTowardsButton) {
      // 延迟重置，给用户足够时间移动到按钮上
      setTimeout(() => {
        // 只有当按钮不在悬停状态时才重置
        if (downloadButton.dataset.hovering !== 'true') {
          currentHoverImg = null;
        }
      }, 800);
    } else {
      // 如果鼠标不是向按钮移动，延迟较短时间后重置
      setTimeout(() => {
        // 只有当按钮不在悬停状态时才重置
        if (downloadButton.dataset.hovering !== 'true') {
          currentHoverImg = null;
        }
      }, 300);
    }
  } else {
    // 非即梦网站使用原来的逻辑
    currentHoverImg = null;
  }
  
  // 使用延时隐藏按钮，给用户足够时间移动到按钮上
  setTimeout(() => {
    // 如果按钮正在被悬停，不要隐藏
    if (downloadButton.dataset.hovering === 'true') {
      return;
    }
    
    // 检查鼠标是否在按钮上，如果不在才隐藏
    const buttonRect = downloadButton.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // 在即梦网站上增加额外的判断条件，确保按钮不会意外消失
    if (isJimengSite) {
      // 增加一个更大的判断区域，防止鼠标轻微移动导致按钮消失
      const buffer = 40; // 更大的像素缓冲区
      if (mouseX < buttonRect.left - buffer || mouseX > buttonRect.right + buffer || 
          mouseY < buttonRect.top - buffer || mouseY > buttonRect.bottom + buffer) {
        // 只有当鼠标确实远离按钮时才隐藏
        if (!window.buttonStableMode) { // 使用全局变量检查是否处于稳定模式
          downloadButton.style.display = 'none';
        }
      }
    } else {
      // 豆包网站使用原来的逻辑
      if (mouseX < buttonRect.left || mouseX > buttonRect.right || 
          mouseY < buttonRect.top || mouseY > buttonRect.bottom) {
        downloadButton.style.display = 'none';
      }
    }
  }, isJimengSite ? 500 : 50); // 在即梦网站上大幅增加延迟时间
}

// 处理下载按钮点击事件
function handleDownloadClick(event) {
  // 阻止事件冒泡
  event.stopPropagation();
  event.preventDefault();
  
  // 确保按钮在点击过程中保持显示
  downloadButton.style.display = 'block';
  
  const imgSrc = downloadButton.dataset.imgSrc;
  if (imgSrc) {
    // 从URL中提取文件名
    const fileName = imgSrc.split('/').pop().split('?')[0] || 'image.jpg';
    
    // 显示下载中状态
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '下载中...';
    
    // 使用fetch获取图片内容
    fetch(imgSrc)
      .then(response => response.blob())
      .then(blob => {
        // 创建Blob URL
        const blobUrl = URL.createObjectURL(blob);
        
        // 创建下载链接并触发点击
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        
        // 恢复按钮文本
        downloadButton.innerHTML = originalText;
        
        // 在即梦网站上，保持按钮显示一段时间后再隐藏
        if (isJimengSite) {
          setTimeout(() => {
            // 只有当鼠标不在按钮上时才隐藏
            if (downloadButton.dataset.hovering !== 'true' && !currentHoverImg) {
              downloadButton.style.display = 'none';
            }
          }, 1000);
        }
      })
      .catch(error => {
        console.error('下载图片失败:', error);
        downloadButton.innerHTML = originalText;
      });
  }
}

// 添加下载按钮点击事件监听
downloadButton.addEventListener('click', handleDownloadClick);

// 监听页面上的所有图片
function setupImageListeners() {
  // 移除旧的事件监听器，防止重复绑定
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.removeEventListener('mouseenter', handleMouseEnter);
    img.removeEventListener('mouseleave', handleMouseLeave);
    
    // 添加新的事件监听器
    img.addEventListener('mouseenter', handleMouseEnter);
    img.addEventListener('mouseleave', handleMouseLeave);
    
    // 针对即梦网站，增加额外的点击事件监听
    if (isJimengSite) {
      // 防止图片点击事件影响下载按钮
      img.addEventListener('click', (e) => {
        // 如果下载按钮正在显示，阻止事件冒泡
        if (downloadButton.style.display === 'block' && 
            currentHoverImg === img) {
          // 检查点击位置是否在下载按钮区域
          const buttonRect = downloadButton.getBoundingClientRect();
          const clickX = e.clientX;
          const clickY = e.clientY;
          
          // 如果点击在按钮区域附近，阻止事件传播
          const buffer = 15;
          if (clickX >= buttonRect.left - buffer && clickX <= buttonRect.right + buffer && 
              clickY >= buttonRect.top - buffer && clickY <= buttonRect.bottom + buffer) {
            e.stopPropagation();
            e.preventDefault();
          }
        }
      }, true); // 使用捕获阶段
    }
  });
}

// 初始化监听
setupImageListeners();

// 添加窗口滚动事件监听，确保按钮位置正确
window.addEventListener('scroll', () => {
  if (currentHoverImg && downloadButton.style.display === 'block') {
    const rect = currentHoverImg.getBoundingClientRect();
    
    // 检查是否在即梦网站上
    const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');
    
    // 根据网站调整按钮位置
    if (isJimengSite) {
      downloadButton.style.top = `${window.scrollY + rect.top + 15}px`;
      downloadButton.style.left = `${window.scrollX + rect.left + 15}px`;
    } else {
      downloadButton.style.top = `${window.scrollY + rect.top + 10}px`;
      downloadButton.style.left = `${window.scrollX + rect.left + 10}px`;
    }
  }
});

// 使用MutationObserver监听DOM变化，处理动态加载的图片
const observer = new MutationObserver(mutations => {
  let hasNewNodes = false;
  
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      hasNewNodes = true;
    }
  });
  
  // 只在确实有新节点时才重新设置监听器
  if (hasNewNodes) {
    setupImageListeners();
  }
});

// 开始观察DOM变化
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 针对即梦网站的特殊初始化
if (isJimengSite) {
  // 确保下载按钮在即梦网站上正常工作
  console.log('在即梦网站上初始化图片下载助手');
  
  // 添加额外的文档级事件监听
  document.addEventListener('click', (e) => {
    // 如果点击了下载按钮，阻止事件传播
    if (e.target === downloadButton || downloadButton.contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
  
  // 修复即梦网站上的z-index问题
  const fixZIndexInterval = setInterval(() => {
    if (downloadButton.style.display === 'block') {
      // 确保按钮始终在最上层
      downloadButton.style.zIndex = '2147483647';
    }
  }, 100);
  
  // 页面卸载时清理
  window.addEventListener('unload', () => {
    clearInterval(fixZIndexInterval);
  });
}