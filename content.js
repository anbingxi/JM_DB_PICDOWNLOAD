// 图片下载助手内容脚本

// 当前悬停的图片元素
let currentHoverImg = null;

// 获取元素的所有祖先元素
function getAncestors(element) {
  const ancestors = [];
  while (element) {
    ancestors.unshift(element);
    element = element.parentElement;
  }
  return ancestors;
}

// 创建下载按钮元素
function createDownloadButton() {
  const button = document.createElement('div');
  button.className = 'image-download-button';
  button.innerHTML = '下载';
  button.style.display = 'none';
  // 确保按钮是body的直接子元素，并位于最顶层
  document.body.insertBefore(button, document.body.firstChild);
  
  // 检查是否在即梦网站上
  const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');
  
  // 为即梦网站设置特殊样式，防止闪烁
  if (isJimengSite) {
    // 调整按钮大小，使其更紧凑
    button.style.padding = '5px 8px';
    button.style.minWidth = '40px';
    button.style.minHeight = '20px';
    button.style.fontSize = '12px';
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

// 添加捕获阶段的点击事件监听器
window.addEventListener('click', (e) => {
  if (e.target === downloadButton) {
    // 阻止事件冒泡和默认行为
    e.stopPropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    
    // 确保按钮在点击过程中保持显示
    downloadButton.style.display = 'block';
    
    // 在即梦网站上，确保按钮在最上层
    if (isJimengSite) {
      downloadButton.style.zIndex = '2147483647';
      downloadButton.style.pointerEvents = 'auto';
      void downloadButton.offsetHeight; // 强制重绘
      
      // 检查并临时禁用可能拦截点击的元素
      const elements = document.elementsFromPoint(
        event.clientX,
        event.clientY
      );
      
      elements.forEach(el => {
        if (el !== downloadButton && (el.style.zIndex > downloadButton.style.zIndex || 
            el.className.includes('edit-button') || el.className.includes('editor'))) {
          el.style.pointerEvents = 'none';
          setTimeout(() => {
            el.style.pointerEvents = '';
          }, 1000);
        }
      });
    }
    
    // 触发下载逻辑
    handleDownloadClick(e);
  }
}, true);

// 检查是否在即梦网站上
const isJimengSite = window.location.hostname.includes('jimeng.jianying.com');

// 添加定期检查按钮存在性的函数
function checkButtonExistence() {
  if (!document.body.contains(downloadButton)) {
    document.body.appendChild(downloadButton);
    console.log('检测到下载按钮被移除，已重新创建');
    
    // 在即梦网站上确保按钮在最上层
    if (isJimengSite) {
      downloadButton.style.zIndex = '2147483647';
      downloadButton.style.pointerEvents = 'auto';
      // 强制重绘DOM，确保z-index生效
      void downloadButton.offsetHeight;
      
      // 添加MutationObserver监听按钮位置变化和层级检查
      const observer = new MutationObserver(() => {
        // 确保按钮在body的直接子元素中
        if (downloadButton.parentNode !== document.body) {
          document.body.insertBefore(downloadButton, document.body.firstChild);
        }
        
        // 在即梦网站上，检查并确保按钮始终在最上层
        if (isJimengSite) {
          // 检查所有覆盖元素，包括编辑按钮
          const elements = document.elementsFromPoint(
            downloadButton.getBoundingClientRect().left + 10,
            downloadButton.getBoundingClientRect().top + 10
          );
          
          for (const el of elements) {
            if (el !== downloadButton && (el.style.zIndex > downloadButton.style.zIndex || 
                el.className.includes('edit-button') || el.className.includes('editor'))) {
              // 调整覆盖元素的z-index，特别是编辑按钮
              el.style.zIndex = '2147483646';
              // 确保编辑按钮不会阻止点击事件
              if (el.className.includes('edit-button') || el.className.includes('editor')) {
                el.style.pointerEvents = 'none';
                // 确保编辑按钮不会导致下载按钮被隐藏
                downloadButton.style.display = 'block';
              }
            }
          }
          
          // 强制按钮显示在最上层
          downloadButton.style.zIndex = '2147483647';
          void downloadButton.offsetHeight; // 强制重绘
        }
      });
      
      // 监听更广泛的DOM变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  }
}

// 每500毫秒检查一次按钮是否存在
setInterval(checkButtonExistence, 500);

// 创建一个全局标志变量，用于跟踪按钮是否处于稳定状态
window.buttonStableMode = false;

// 针对即梦网站添加额外的事件处理
if (isJimengSite) {
  // 监听DOM变化，检测编辑按钮的出现
  const editButtonObserver = new MutationObserver(() => {
    const editButtons = document.querySelectorAll('.edit-button, .editor');
    editButtons.forEach(btn => {
      if (btn.style.zIndex > downloadButton.style.zIndex) {
        btn.style.zIndex = '2147483646';
        btn.style.pointerEvents = 'none';
      }
    });
  });
  
  editButtonObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
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
  
  const target = event.target;
  
  // 检查元素类型和尺寸
  let src = '';
  if (target.tagName === 'IMG') {
    // 处理图片元素
    const rect = target.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 50) {
      return;
    }
    src = target.src;
  } else if (target.tagName === 'VIDEO') {
    // 处理视频元素
    const rect = target.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 50) {
      return;
    }
    src = target.src;
  } else {
    return;
  }
  
  // 在即梦网站上，检查父元素是否包含'resultContainer'开头的class
  if (isJimengSite) {
    let parent = target.parentElement;
    let hasResultContainer = false;
    while (parent && parent !== document.body) {
      if (parent.className && typeof parent.className === 'string' && 
          (parent.className.split(' ').some(cls => cls.startsWith('explore-content')) || parent.className.split(' ').some(cls => cls.startsWith('resultContainer'))) ) {
        hasResultContainer = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!hasResultContainer) {
      return;
    }
  }
  
  // 在即梦网站上，立即强制按钮显示在最上层
  if (isJimengSite) {
    downloadButton.style.zIndex = '2147483647';
    void downloadButton.offsetHeight; // 强制重绘
  }
  
  currentHoverImg = target;
  
  const rect = target.getBoundingClientRect();
  downloadButton.style.top = `${window.scrollY + rect.top + rect.height/2 - 15}px`;
  downloadButton.style.left = `${window.scrollX + rect.left + rect.width/2 - 15}px`;
  
  // 显示下载按钮
  downloadButton.style.display = 'block';
  
  // 针对即梦网站，检查并处理覆盖div
  if (isJimengSite) {
    // 强制按钮显示在最上层
    document.body.insertBefore(downloadButton, document.body.firstChild);
    
    // 检查是否有覆盖div
    const elements = document.elementsFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
    for (const el of elements) {
      if (el !== target && el !== downloadButton && el.style.zIndex > downloadButton.style.zIndex) {
        // 调整覆盖div的z-index
        el.style.zIndex = '2147483646';
      }
    }
  }
  
  // 设置当前资源URL
  downloadButton.dataset.imgSrc = src;
}

// 处理鼠标移出图片事件
function handleMouseLeave(event) {
  // 阻止事件冒泡
  event.stopPropagation();
  
  // 如果不是即梦网站，立即隐藏按钮
  if (!isJimengSite) {
    downloadButton.style.display = 'none';
    currentHoverImg = null;
  }
}

// 处理下载按钮点击事件
function handleDownloadClick(event) {
  // 打印完整事件信息用于调试
  console.log('下载按钮点击事件详情:', {
    eventType: event.type,
    target: event.target,
    currentTarget: event.currentTarget,
    eventPhase: event.eventPhase,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    timeStamp: event.timeStamp,
    isTrusted: event.isTrusted,
    // 记录完整的事件传播路径
    composedPath: event.composedPath(),
    // 记录按钮的DOM层级关系
    buttonAncestors: getAncestors(event.target),
    // 记录按钮的CSS属性
    buttonComputedStyle: window.getComputedStyle(event.target)
  });
  
  // 检查事件是否已经被处理
  if (event.defaultPrevented) {
    console.warn('事件已被其他监听器阻止');
  }
  
  
  
  const resourceSrc = downloadButton.dataset.imgSrc;
  if (resourceSrc) {
    // 打印资源地址和调试信息
    console.log('资源下载开始:', {
      resourceSrc: resourceSrc,
      timestamp: new Date().toISOString(),
      buttonState: {
        display: downloadButton.style.display,
        zIndex: downloadButton.style.zIndex,
        position: downloadButton.getBoundingClientRect()
      }
    });
    
    // 在即梦网站上检查资源是否存在
    if (isJimengSite && !resourceSrc) {
      console.error('即梦网站错误: 未找到资源地址');
      return;
    }
    // 在即梦网站上打印额外调试信息
    if (isJimengSite) {
      console.log('即梦网站资源地址:', resourceSrc);
      console.debug('即梦网站下载按钮状态:', {
        display: downloadButton.style.display,
        zIndex: downloadButton.style.zIndex,
        pointerEvents: downloadButton.style.pointerEvents,
        position: downloadButton.getBoundingClientRect()
      });
    }
    // 从URL中提取文件名
    let fileName = resourceSrc.split('/').pop().split('?')[0];
    if (!fileName) {
      fileName = currentHoverImg.tagName === 'VIDEO' ? 'video.mp4' : 'image.jpg';
    }
    
    // 显示下载中状态
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '下载中...';
    
    // 在即梦网站上添加调试日志
    if (isJimengSite) {
      console.log('即梦网站下载开始:', {
        resourceSrc: resourceSrc,
        fileName: fileName,
        buttonPosition: downloadButton.getBoundingClientRect(),
        hoverState: downloadButton.dataset.hovering,
        currentHoverImg: currentHoverImg
      });
    }
    
    // 使用fetch获取资源内容
    fetch(resourceSrc)
      .then(response => {
        if (isJimengSite) {
          console.log('即梦网站获取资源响应状态:', response.status);
          console.debug('即梦网站响应头:', Object.fromEntries(response.headers.entries()));
        }
        
        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        // 检查内容类型是否为图片或视频
        const contentType = response.headers.get('content-type');
        if (!contentType || !(contentType.startsWith('image/') || contentType.startsWith('video/'))) {
          throw new Error(`无效的内容类型: ${contentType}`);
        }
        
        return response.blob();
      })
      .then(blob => {
        // 创建Blob URL
        const blobUrl = URL.createObjectURL(blob);
        
        if (isJimengSite) {
          console.log('即梦网站创建Blob URL成功:', blobUrl);
        }
        
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
        
        if (isJimengSite) {
          console.log('即梦网站下载完成:', fileName);
          console.log('下载资源类型:', currentHoverImg.tagName);
        }
        
        // 在即梦网站上，保持按钮显示一段时间后再隐藏
        if (isJimengSite) {
          setTimeout(() => {
            // 只有当鼠标不在按钮上时才隐藏
            if (downloadButton.dataset.hovering !== 'true' && !currentHoverImg) {
              downloadButton.style.display = 'none';
              if (isJimengSite) {
                console.log('即梦网站隐藏下载按钮');
              }
            }
          }, 1000);
        }
      })
      .catch(error => {
        console.error('下载资源失败:', error);
        if (isJimengSite) {
          console.error('即梦网站下载失败:', {
            error: error,
            resourceSrc: resourceSrc,
            timestamp: new Date().toISOString()
          });
        }
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
  const videos = document.querySelectorAll('video');
  
  // 处理图片元素
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
  
  // 处理视频元素
  videos.forEach(video => {
    video.removeEventListener('mouseenter', handleMouseEnter);
    video.removeEventListener('mouseleave', handleMouseLeave);
    
    // 添加新的事件监听器
    video.addEventListener('mouseenter', handleMouseEnter);
    video.addEventListener('mouseleave', handleMouseLeave);
    
    // 针对即梦网站，增加额外的点击事件监听
    if (isJimengSite) {
      // 防止视频点击事件影响下载按钮
      video.addEventListener('click', (e) => {
        // 如果下载按钮正在显示，阻止事件冒泡
        if (downloadButton.style.display === 'block' && 
            currentHoverImg === video) {
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
  let buttonRemoved = false;
  
  mutations.forEach(mutation => {
    // 检查是否有节点被移除
    if (mutation.removedNodes.length) {
      mutation.removedNodes.forEach(node => {
        if (node === downloadButton) {
          buttonRemoved = true;
        }
      });
    }
    
    if (mutation.addedNodes.length) {
      hasNewNodes = true;
      
      // 检查是否有图片节点被添加
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 确保下载按钮仍然存在，如果不存在则重新创建
          if (!document.body.contains(downloadButton)) {
            document.body.appendChild(downloadButton);
            console.log('检测到下载按钮被移除，已重新创建');
          }
        }
      });
    }
  });
  
  // 如果按钮被移除或DOM有变化，重新创建按钮并设置监听
  if (buttonRemoved || hasNewNodes) {
    if (!document.body.contains(downloadButton)) {
      document.body.appendChild(downloadButton);
      console.log('检测到下载按钮被移除，已重新创建');
    }
    setupImageListeners();
    
    // 在即梦网站上，额外确保按钮在最上层
    if (isJimengSite) {
      downloadButton.style.zIndex = '2147483647';
      downloadButton.style.pointerEvents = 'auto';
    }
  }
});

// 开始观察DOM变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
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
    // 检测即梦编辑按钮并调整z-index
    if (e.target.classList.contains('jimeng-edit-button')) {
      downloadButton.style.zIndex = '2147483647';
      void downloadButton.offsetHeight;
    }
  }, true);
  
  // 修复即梦网站上的z-index问题
  const fixZIndexInterval = setInterval(() => {
    if (downloadButton.style.display === 'block') {
      // 确保按钮始终在最上层
      downloadButton.style.zIndex = '2147483647';
      // 强制重绘DOM，确保z-index生效
      void downloadButton.offsetHeight;
    }
  }, 100);
  
  // 页面卸载时清理
  window.addEventListener('unload', () => {
    clearInterval(fixZIndexInterval);
  });
}