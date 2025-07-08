// Enhanced Scan Modal JavaScript
// This file provides additional functionality for the QR scan page

class ScanModal {
  constructor() {
    this.modal = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    // Create modal element if it doesn't exist
    if (!document.getElementById('scanModal')) {
      this.createModal();
    }
    this.modal = document.getElementById('scanModal');
  }

  createModal() {
    const modalHTML = `
      <div id="scanModal" class="scan-modal" style="display: none;">
        <div class="scan-modal-content">
          <div class="scan-modal-header">
            <h3 id="scanModalTitle">Scan Information</h3>
            <button class="scan-modal-close" onclick="scanModal.close()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="scan-modal-body">
            <div class="scan-modal-icon" id="scanModalIcon">
              <i class="fas fa-info-circle"></i>
            </div>
            <p id="scanModalMessage">This is a modal message.</p>
          </div>
          <div class="scan-modal-footer">
            <button class="scan-modal-btn" onclick="scanModal.close()">Got it!</button>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const modalStyles = `
      <style>
        .scan-modal {
          display: none;
          position: fixed;
          z-index: 2000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .scan-modal-content {
          background: white;
          margin: 10% auto;
          padding: 0;
          border-radius: 20px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          animation: modalSlideDown 0.3s ease;
          overflow: hidden;
        }

        @keyframes modalSlideDown {
          from {
            opacity: 0;
            transform: translateY(-60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .scan-modal-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .scan-modal-header h3 {
          margin: 0;
          font-size: 1.3em;
          font-weight: 600;
        }

        .scan-modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .scan-modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .scan-modal-body {
          padding: 32px 24px 24px 24px;
          text-align: center;
        }

        .scan-modal-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 2em;
        }

        .scan-modal-icon.success {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
        }

        .scan-modal-icon.error {
          background: linear-gradient(135deg, #f56565, #e53e3e);
          color: white;
        }

        .scan-modal-icon.info {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: white;
        }

        .scan-modal-icon.warning {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
        }

        .scan-modal-body p {
          color: #4a5568;
          font-size: 1.1em;
          line-height: 1.6;
          margin: 0;
        }

        .scan-modal-footer {
          padding: 0 24px 24px 24px;
          text-align: center;
        }

        .scan-modal-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .scan-modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .scan-modal-btn.secondary {
          background: linear-gradient(135deg, #a0aec0, #718096);
        }

        .scan-modal-btn.secondary:hover {
          box-shadow: 0 8px 24px rgba(160, 174, 192, 0.3);
        }

        @media (max-width: 600px) {
          .scan-modal-content {
            margin: 20% auto;
            width: 95%;
          }
          
          .scan-modal-header {
            padding: 16px 20px;
          }
          
          .scan-modal-body {
            padding: 24px 20px 20px 20px;
          }
          
          .scan-modal-footer {
            padding: 0 20px 20px 20px;
          }
        }
      </style>
    `;

    // Add styles to head
    if (!document.getElementById('scanModalStyles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'scanModalStyles';
      styleElement.innerHTML = modalStyles;
      document.head.appendChild(styleElement);
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  show(title, message, type = 'info', options = {}) {
    if (!this.modal) {
      this.init();
    }

    const titleElement = document.getElementById('scanModalTitle');
    const messageElement = document.getElementById('scanModalMessage');
    const iconElement = document.getElementById('scanModalIcon');

    // Set content
    titleElement.textContent = title;
    messageElement.textContent = message;

    // Set icon and type
    iconElement.className = `scan-modal-icon ${type}`;
    const icon = iconElement.querySelector('i');
    
    switch (type) {
      case 'success':
        icon.className = 'fas fa-check-circle';
        break;
      case 'error':
        icon.className = 'fas fa-exclamation-circle';
        break;
      case 'warning':
        icon.className = 'fas fa-exclamation-triangle';
        break;
      default:
        icon.className = 'fas fa-info-circle';
    }

    // Show modal
    this.modal.style.display = 'block';
    this.isVisible = true;

    // Auto-hide if specified
    if (options.autoHide) {
      setTimeout(() => {
        this.close();
      }, options.autoHide);
    }

    // Call onShow callback if provided
    if (options.onShow) {
      options.onShow();
    }
  }

  close() {
    if (this.modal) {
      this.modal.style.display = 'none';
      this.isVisible = false;
    }
  }

  // Convenience methods
  success(title, message, options = {}) {
    this.show(title, message, 'success', options);
  }

  error(title, message, options = {}) {
    this.show(title, message, 'error', options);
  }

  warning(title, message, options = {}) {
    this.show(title, message, 'warning', options);
  }

  info(title, message, options = {}) {
    this.show(title, message, 'info', options);
  }
}

// Create global instance
const scanModal = new ScanModal();

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('scan-modal')) {
    scanModal.close();
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScanModal;
}
