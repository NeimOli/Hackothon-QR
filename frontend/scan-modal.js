// scan-modal.js
// Enhanced popup modal display for scan.html

function showModalMessage(type, title, message) {
  const modal = document.getElementById('modal-message');
  const content = modal.querySelector('.modal-content');
  
  // Set modal type and styling
  content.className = 'modal-content ' + type;
  content.querySelector('h3').textContent = title;
  
  // Handle HTML content in message
  const messageElement = content.querySelector('p');
  if (message.includes('<br>')) {
    messageElement.innerHTML = message;
  } else {
    messageElement.textContent = message;
  }
  
  // Show modal with animation
  modal.classList.add('active');
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (modal.classList.contains('active')) {
        closeModalMessage();
      }
    }, 5000);
  }
  
  // Auto-hide info messages after 3 seconds
  if (type === 'info' && !message.includes('Processing')) {
    setTimeout(() => {
      if (modal.classList.contains('active')) {
        closeModalMessage();
      }
    }, 3000);
  }
}

function closeModalMessage() {
  const modal = document.getElementById('modal-message');
  modal.classList.remove('active');
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById('modal-message');
  if (modal.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeModalMessage();
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.onclick = closeModalMessage;
  }
  
  // Close modal on background click
  const modal = document.getElementById('modal-message');
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === this) {
        closeModalMessage();
      }
    };
  }
});

// Export for inline use
window.showModalMessage = showModalMessage;
window.closeModalMessage = closeModalMessage;
