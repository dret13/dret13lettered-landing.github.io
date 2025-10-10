/**
 * Deep Link Detection and Handler for Lettered Landing Page
 * Add this script before the closing </body> tag in index.html
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        appScheme: 'lettered://',
        httpsScheme: 'https://ltrd.space/',
        appStoreUrls: {
            ios: 'https://apps.apple.com/app/lettered/id123456789', // Update with real App Store ID
            android: 'https://play.google.com/store/apps/details?id=com.lettered.app'
        }
    };
    
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    
    // Parse current URL for deep link
    function parseDeepLink() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(Boolean);
        
        // Check for deep link patterns: /profile/:id, /post/:id, /stream/:id
        if (pathParts.length >= 2) {
            const type = pathParts[0];
            const id = pathParts[1];
            
            if (['profile', 'post', 'stream'].includes(type)) {
                return {
                    isDeepLink: true,
                    type: type,
                    id: id,
                    fullPath: `${type}/${id}`
                };
            }
        }
        
        return { isDeepLink: false };
    }
    
    // Attempt to open app
    function openApp(deepLink) {
        const customSchemeUrl = `${config.appScheme}${deepLink.fullPath}`;
        
        console.log('Attempting to open app:', customSchemeUrl);
        
        // Try to open with custom scheme
        window.location = customSchemeUrl;
        
        // For iOS, also try with timeout fallback
        if (isIOS) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = customSchemeUrl;
            document.body.appendChild(iframe);
            
            setTimeout(function() {
                document.body.removeChild(iframe);
            }, 2000);
        }
    }
    
    // Show deep link modal
    function showDeepLinkModal(deepLink) {
        // Prevent showing modal if already exists
        if (document.getElementById('deep-link-modal')) {
            return;
        }
        
        const contentTypeLabels = {
            profile: 'profile',
            post: 'post',
            stream: 'live stream'
        };
        
        const contentIcon = {
            profile: '👤',
            post: '📝',
            stream: '🎥'
        };
        
        const label = contentTypeLabels[deepLink.type] || 'content';
        const icon = contentIcon[deepLink.type] || 'L';
        
        const modalHTML = `
            <div id="deep-link-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                    animation: slideUp 0.3s ease;
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 36px;
                        font-weight: bold;
                    ">${icon}</div>
                    
                    <h2 style="
                        margin-bottom: 10px;
                        color: #333;
                        font-size: 24px;
                        font-weight: 600;
                    ">Open in Lettered App?</h2>
                    
                    <p style="
                        color: #666;
                        margin-bottom: 30px;
                        line-height: 1.5;
                    ">
                        View this ${label} in the Lettered app for the best experience.
                    </p>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <button id="open-app-btn" style="
                            padding: 15px 30px;
                            border-radius: 10px;
                            border: none;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 16px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            Open in App
                        </button>
                        
                        <button id="close-modal-btn" style="
                            padding: 15px 30px;
                            border-radius: 10px;
                            border: none;
                            background: #f5f5f5;
                            color: #333;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 16px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                            Continue on Web
                        </button>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 14px; margin-bottom: 15px;">Don't have the app yet?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <a href="${config.appStoreUrls.ios}" target="_blank" rel="noopener" style="text-decoration: none;">
                                <button style="
                                    padding: 10px 20px;
                                    border-radius: 8px;
                                    border: 1px solid #ddd;
                                    background: white;
                                    cursor: pointer;
                                    font-size: 14px;
                                    transition: background 0.2s;
                                " onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='white'">
                                    📱 Download for iOS
                                </button>
                            </a>
                            <a href="${config.appStoreUrls.android}" target="_blank" rel="noopener" style="text-decoration: none;">
                                <button style="
                                    padding: 10px 20px;
                                    border-radius: 8px;
                                    border: 1px solid #ddd;
                                    background: white;
                                    cursor: pointer;
                                    font-size: 14px;
                                    transition: background 0.2s;
                                " onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='white'">
                                    🤖 Download for Android
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.getElementById('open-app-btn').addEventListener('click', function() {
            openApp(deepLink);
        });
        
        document.getElementById('close-modal-btn').addEventListener('click', function() {
            const modal = document.getElementById('deep-link-modal');
            if (modal) {
                modal.remove();
            }
        });
        
        // Close modal on background click
        document.getElementById('deep-link-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }
    
    // Main initialization
    function init() {
        const deepLink = parseDeepLink();
        
        if (deepLink.isDeepLink) {
            console.log('Deep link detected:', deepLink);
            
            // Only attempt automatic redirect on mobile
            if (isMobile) {
                // Try to open app immediately
                openApp(deepLink);
                
                // Show modal after a delay if app didn't open
                setTimeout(function() {
                    showDeepLinkModal(deepLink);
                }, 1500);
            } else {
                // On desktop, just show the modal
                showDeepLinkModal(deepLink);
            }
        }
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also expose for manual triggering if needed
    window.LetteredDeepLink = {
        openApp: openApp,
        showModal: showDeepLinkModal,
        parseDeepLink: parseDeepLink
    };
    
})();


