// const { set } = require("../../../server/utils/nodemailer");

// API Configuration
const API_BASE_URL = '/api/v1';
let currentWithdrawalId = null;
let currentUserId = null;
let currentAction = null;

// DOM Elements
const pendingWithdrawalsBody = document.getElementById('pending-withdrawals-body');
const processedWithdrawalsBody = document.getElementById('processed-withdrawals-body');
const pendingSpinner = document.getElementById('pending-spinner');
const processedSpinner = document.getElementById('processed-spinner');
const pendingEmpty = document.getElementById('pending-empty');
const processedEmpty = document.getElementById('processed-empty');
const pendingCount = document.getElementById('pending-count');
const processedCount = document.getElementById('processed-count');

// Get auth token
const authToken = localStorage.getItem('token') || 'your-auth-token-here';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin withdrawal page initialized');
    setupEventListeners();
    loadWithdrawalData();
    setInterval(loadWithdrawalData, 70000);
});

// Setup all event listeners
function setupEventListeners() {
    // Mobile sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Tab switching
    const tabLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Edit Withdrawal Modal
    const withdrawalModal = document.getElementById('editWithdrawalModal');
    const closeWithdrawalModal = document.getElementById('closeWithdrawalModal');

    function closeWithdrawalModalFunc() {
        if (withdrawalModal) withdrawalModal.classList.remove('active');
        const addBalanceForm = document.getElementById('addBalanceForm');
        const subtractBalanceForm = document.getElementById('subtractBalanceForm');
        if (addBalanceForm) addBalanceForm.reset();
        if (subtractBalanceForm) subtractBalanceForm.reset();
        const addBalanceError = document.getElementById('addBalanceError');
        const subtractBalanceError = document.getElementById('subtractBalanceError');
        if (addBalanceError) addBalanceError.style.display = 'none';
        if (subtractBalanceError) subtractBalanceError.style.display = 'none';
    }

    if (closeWithdrawalModal) {
        closeWithdrawalModal.addEventListener('click', closeWithdrawalModalFunc);
    }

    if (withdrawalModal) {
        withdrawalModal.addEventListener('click', (e) => {
            if (e.target === withdrawalModal) {
                closeWithdrawalModalFunc();
            }
        });
    }

    // Balance adjustment forms
    const addBalanceForm = document.getElementById('addBalanceForm');
    const subtractBalanceForm = document.getElementById('subtractBalanceForm');

    if (addBalanceForm) {
        addBalanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amountInput = addBalanceForm.querySelector('input');
            const amount = parseFloat(amountInput.value);
            const errorElement = document.getElementById('addBalanceError');
            
            if (!amount || isNaN(amount) || amount < 0.01) {
                if (errorElement) errorElement.style.display = 'block';
                return;
            }
            
            if (errorElement) errorElement.style.display = 'none';
            showConfirmation('Add Balance', `Are you sure you want to add $${amount.toFixed(2)} to this user's balance?`, 
                () => adjustUserBalance(currentUserId, 'add', amount));
        });
    }

    if (subtractBalanceForm) {
        subtractBalanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amountInput = subtractBalanceForm.querySelector('input');
            const amount = parseFloat(amountInput.value);
            const errorElement = document.getElementById('subtractBalanceError');
            
            if (!amount || isNaN(amount) || amount < 0.01) {
                if (errorElement) errorElement.style.display = 'block';
                return;
            }
            
            if (errorElement) errorElement.style.display = 'none';
            showConfirmation('Subtract Balance', `Are you sure you want to subtract $${amount.toFixed(2)} from this user's balance?`, 
                () => adjustUserBalance(currentUserId, 'subtract', amount));
        });
    }

    // Message Modal
    setupModal('messageModal', 'closeMessageModal', 'confirmMessage');
    
    // Confirmation Modal
    setupModal('confirmationModal', 'closeConfirmationModal', 'cancelAction', 'confirmAction');
}

function setupModal(modalId, closeBtnId, cancelBtnId, confirmBtnId = null) {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);
    const confirmBtn = confirmBtnId ? document.getElementById(confirmBtnId) : null;

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (confirmBtn && confirmBtnId) {
        confirmBtn.addEventListener('click', () => {
            closeModal();
            if (currentAction) {
                currentAction();
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Show confirmation modal
function showConfirmation(title, message, action) {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationText = document.getElementById('confirmationText');
    
    if (confirmationModal && confirmationTitle && confirmationText) {
        confirmationTitle.textContent = title;
        confirmationText.textContent = message;
        currentAction = action;
        confirmationModal.classList.add('active');
    }
}

// Show message modal
function showMessage(title, message, isSuccess = true) {
    const messageModal = document.getElementById('messageModal');
    const messageTitle = document.getElementById('messageTitle');
    const messageText = document.getElementById('messageText');
    const messageIcon = document.getElementById('messageIcon');
    
    if (messageModal && messageTitle && messageText && messageIcon) {
        messageTitle.textContent = title;
        messageText.textContent = message;
        
        messageIcon.innerHTML = isSuccess
            ? '<i class="fas fa-check-circle success-icon"></i>'
            : '<i class="fas fa-exclamation-circle error-icon"></i>';
        
        messageModal.classList.add('active');
    }
}

// Load withdrawal data from API
async function loadWithdrawalData() {
    try {
        if (pendingSpinner) pendingSpinner.style.display = 'block';
        if (processedSpinner) processedSpinner.style.display = 'block';
        if (pendingEmpty) pendingEmpty.style.display = 'none';
        if (processedEmpty) processedEmpty.style.display = 'none';

        console.log('Loading withdrawal data...');
        const response = await fetch(`${API_BASE_URL}/admin/withdrawal`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 401){
            setTimeout(() =>{
                window.location.href = '../index.html'
            }, 3000)
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
        
        const withdrawals = result.data?.withdrawals || result.withdrawals || [];
        const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
        const processedWithdrawals = withdrawals.filter(w => w.status !== 'pending');
        
        if (pendingCount) pendingCount.textContent = pendingWithdrawals.length;
        if (processedCount) processedCount.textContent = processedWithdrawals.length;
        
        if (pendingWithdrawalsBody) {
            renderWithdrawalTable(pendingWithdrawals, pendingWithdrawalsBody, pendingSpinner, pendingEmpty, true);
        }
        if (processedWithdrawalsBody) {
            renderWithdrawalTable(processedWithdrawals, processedWithdrawalsBody, processedSpinner, processedEmpty, false);
        }
    } catch (error) {
        console.error('Error loading withdrawal data:', error);
        showMessage('Error', `Failed to load withdrawal data: ${error.message}`, false);
        if (pendingSpinner) pendingSpinner.style.display = 'none';
        if (processedSpinner) processedSpinner.style.display = 'none';
        if (pendingEmpty) pendingEmpty.style.display = 'block';
        if (processedEmpty) processedEmpty.style.display = 'block';
    }
}

// Render withdrawal table
function renderWithdrawalTable(withdrawals, tableBody, spinner, emptyMsg, showActions) {
    if (spinner) spinner.style.display = 'none';
    
    if (!withdrawals || withdrawals.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (tableBody) tableBody.innerHTML = '';
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (tableBody) tableBody.innerHTML = '';
    
    withdrawals.forEach(withdrawal => {
        const row = document.createElement('tr');
        const requestDate = new Date(withdrawal.createdAt).toLocaleString();
        
        const withdrawalId = withdrawal.id || withdrawal._id;
        const username = withdrawal.user?.username || 'Unknown User';
        const userId = withdrawal.userId;
        const userObjectId = withdrawal.user?.id;
        
        row.innerHTML = `
            <td>#WTH-${withdrawalId}</td>
            <td>${username}</td>
            <td>$${Number(withdrawal.amount).toFixed(2)}</td>
            <td>${withdrawal.withdrawalMethod || withdrawal.method || 'N/A'}</td>
            <td>${withdrawal.walletAddress}</td>
            <td>${requestDate}</td>
            ${showActions ? `
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit edit-withdrawal" 
                        data-id="${withdrawalId}" 
                        data-user="${username}" 
                        data-amount="${withdrawal.amount}" 
                        data-method="${withdrawal.withdrawalMethod || withdrawal.method || 'N/A'}"
                        data-userid="${userObjectId || userId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-success approve-btn" 
                        data-id="${withdrawalId}" 
                        data-userid="${userObjectId || userId}" 
                        data-amount="${withdrawal.amount}"
                        data-method="${withdrawal.withdrawalMethod || withdrawal.method || 'N/A'}">
                        Approve
                    </button>
                    <button class="btn btn-sm btn-danger reject-btn" 
                        data-id="${withdrawalId}" 
                        data-userid="${userObjectId || userId}" 
                        data-amount="${withdrawal.amount}"
                        data-method="${withdrawal.withdrawalMethod || withdrawal.method || 'N/A'}">
                        Reject
                    </button>
                </div>
            </td>
            ` : `
            <td><span class="badge badge-${withdrawal.status}">${withdrawal.status}</span></td>
            `}
        `;
        
        if (tableBody) tableBody.appendChild(row);
    });
    
    if (showActions && tableBody) {
        // Edit withdrawal buttons
        tableBody.querySelectorAll('.edit-withdrawal').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const transactionId = button.getAttribute('data-id');
                const user = button.getAttribute('data-user');
                const amount = button.getAttribute('data-amount');
                const method = button.getAttribute('data-method');
                const userId = button.getAttribute('data-userid');

                currentWithdrawalId = transactionId;
                currentUserId = userId;

                const withdrawalTransactionId = document.getElementById('withdrawalTransactionId');
                const withdrawalUser = document.getElementById('withdrawalUser');
                const withdrawalAmount = document.getElementById('withdrawalAmount');
                const withdrawalMethod = document.getElementById('withdrawalMethod');

                if (withdrawalTransactionId) withdrawalTransactionId.textContent = `#WTH-${transactionId}`;
                if (withdrawalUser) withdrawalUser.textContent = user;
                if (withdrawalAmount) withdrawalAmount.textContent = `$${Number(amount).toFixed(2)}`;
                if (withdrawalMethod) withdrawalMethod.textContent = method;

                const editWithdrawalModal = document.getElementById('editWithdrawalModal');
                if (editWithdrawalModal) editWithdrawalModal.classList.add('active');
            });
        });
        
        // Approve buttons - Map to 'confirmed' status
        tableBody.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const withdrawalId = button.getAttribute('data-id');
                const userId = button.getAttribute('data-userid');
                const amount = parseFloat(button.getAttribute('data-amount'));
                const withdrawalMethod = button.getAttribute('data-method');
                console.log('Approve clicked - will send "confirmed" status:', { withdrawalId, userId, amount });
                showConfirmation('Approve Withdrawal', `Are you sure you want to approve this withdrawal of $${amount.toFixed(2)}?`, 
                    () => updateWithdrawalStatus(withdrawalId, 'confirmed', userId, amount, withdrawalMethod));
            });
        });
        
        // Reject buttons - Map to 'rejected' status
        tableBody.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const withdrawalId = button.getAttribute('data-id');
                const userId = button.getAttribute('data-userid');
                const amount = parseFloat(button.getAttribute('data-amount'));
                const withdrawalMethod = button.getAttribute('data-method');
                console.log(withdrawalMethod)
                console.log('Reject clicked - will send "rejected" status:', { withdrawalId, userId, amount, withdrawalMethod });
                showConfirmation('Reject Withdrawal', `Are you sure you want to reject this withdrawal of $${amount.toFixed(2)}?`, 
                    () => updateWithdrawalStatus(withdrawalId, 'rejected', userId, amount, withdrawalMethod));
            });
        });
    }
}

// Update withdrawal status - FIXED to match model ENUM
async function updateWithdrawalStatus(withdrawalId, status, userId, amount, withdrawalMethod) {
    try {
        console.log('Updating withdrawal status:', { withdrawalId, status, userId, amount, withdrawalMethod });
        
        // Map frontend status to backend ENUM values
        const statusMap = {
            'approved': 'confirmed',  // Map 'approved' to 'confirmed'
            'rejected': 'failed'      // Map 'rejected' to 'failed'
        };
        
        const backendStatus = statusMap[status] || status;
        
        const endpoint = `${API_BASE_URL}/admin/withdrawal/${withdrawalId}`;
        
        
        const requestBody = {
            withdrawalMethod:withdrawalMethod,
            status: backendStatus
        };
        
        console.log('Request body:', requestBody);
        
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error('Server error response:', errorData);
            } catch (e) {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
                console.error('Server error text:', errorText);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Withdrawal update successful:', result);

        // Show success message
        const actionText = status === 'approved' ? 'approved' : 'rejected';
        showMessage('Success', `Withdrawal ${actionText} successfully!`);
        
        // Reload data after a short delay
        setTimeout(() => {
            loadWithdrawalData();
        }, 1500);

    } catch (error) {
        console.error('Error updating withdrawal status:', error);
        
        // Show specific error messages based on the error
        let userMessage = `Failed to update withdrawal: ${error.message}`;
        
        if (error.message.includes('Invalid status')) {
            userMessage = 'Invalid status value. Please contact support.';
        } else if (error.message.includes('Withdrawal not found')) {
            userMessage = 'Withdrawal not found. It may have been already processed.';
        } else if (error.message.includes('cannot be updated')) {
            userMessage = 'This withdrawal cannot be updated in its current status.';
        } else if (error.message.includes('Data truncated')) {
            userMessage = 'Database error: Invalid status value. Please contact administrator.';
        }
        
        showMessage('Error', userMessage, false);
    }
}

// Adjust user balance (add/subtract)
async function adjustUserBalance(userId, operation, amount) {
    try {
        console.log('Adjusting user balance:', { userId, operation, amount });
        
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/balance`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ 
                operation, 
                amount: amount
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to adjust user balance: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Balance adjustment response:', result);

        showMessage('Success', `User balance ${operation === 'add' ? 'increased' : 'decreased'} by $${amount.toFixed(2)}`);
        
        const editWithdrawalModal = document.getElementById('editWithdrawalModal');
        if (editWithdrawalModal) editWithdrawalModal.classList.remove('active');
        
        const addBalanceForm = document.getElementById('addBalanceForm');
        const subtractBalanceForm = document.getElementById('subtractBalanceForm');
        if (addBalanceForm) addBalanceForm.reset();
        if (subtractBalanceForm) subtractBalanceForm.reset();
        
        loadWithdrawalData();
    } catch (error) {
        console.error('Error adjusting user balance:', error);
        showMessage('Error', `Failed to adjust user balance: ${error.message}`, false);
    }
}