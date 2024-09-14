// Retrieve saved data from local storage or initialize with default values
const savedCookieCount = localStorage.getItem('cookieCount');
const savedCookiesPerClick = localStorage.getItem('cookiesPerClick');
const savedUpgradeLevels = JSON.parse(localStorage.getItem('upgradeLevels')) || {};

// Set initial values
let cookieCount = savedCookieCount ? parseInt(savedCookieCount) : 0;
let cookiesPerClick = savedCookiesPerClick ? parseInt(savedCookiesPerClick) : 1;
const upgradeLevels = savedUpgradeLevels;

// Select DOM elements
const cookieElement = document.getElementById('cookie');
const cookieCountElement = document.getElementById('cookie-count');
const cookiesPerClickElement = document.getElementById('cookies-per-click');
const upgradeButtons = document.querySelectorAll('.upgrade-button');
const upgradeInfoElements = document.querySelectorAll('.upgrade-info');
const adminLoginButton = document.getElementById('admin-login-button');
const adminPopup = document.getElementById('admin-popup');
const loginButton = document.getElementById('login-button');
const cancelButton = document.getElementById('cancel-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const adminMenu = document.getElementById('admin-menu');
const currentCookiesElement = document.getElementById('current-cookies');
const removeCookiesInput = document.getElementById('remove-cookies');
const removeCookiesButton = document.getElementById('remove-cookies-button');
const setCookiesInput = document.getElementById('set-cookies');
const setCookiesButton = document.getElementById('set-cookies-button');

// Function to save game state
function saveGame() {
    localStorage.setItem('cookieCount', cookieCount);
    localStorage.setItem('cookiesPerClick', cookiesPerClick);
    localStorage.setItem('upgradeLevels', JSON.stringify(upgradeLevels));
}

// Function to update the UI
function updateUI() {
    cookieCountElement.textContent = cookieCount;
    cookiesPerClickElement.textContent = cookiesPerClick;
    currentCookiesElement.textContent = cookieCount;

    upgradeButtons.forEach(button => {
        const name = button.getAttribute('data-name');
        const baseCost = parseInt(button.getAttribute('data-base-cost'));
        const baseEffect = parseInt(button.getAttribute('data-base-effect'));

        const level = upgradeLevels[name] || 0;
        const currentCost = Math.floor(baseCost * Math.pow(2, level)); // Increased cost multiplier
        const effect = baseEffect * (level + 1);

        button.textContent = `${name} (Cost: ${currentCost})`;

        const info = document.querySelector(`.upgrade-info[data-name="${name}"]`);
        if (info) {
            info.textContent = `Level: ${level}, Cost: ${currentCost}`;
        }

        button.disabled = cookieCount < currentCost;
    });
}

// Initial UI update on page load
updateUI();

// Event listener for cookie click
cookieElement.addEventListener('click', () => {
    cookieCount += cookiesPerClick;
    console.log(`Cookies: ${cookieCount}, Cookies per Click: ${cookiesPerClick}`);
    updateUI();
    saveGame();
});

// Event listeners for upgrade buttons
upgradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const baseCost = parseInt(button.getAttribute('data-base-cost'));
        const baseEffect = parseInt(button.getAttribute('data-base-effect'));

        const level = upgradeLevels[name] || 0;
        const currentCost = Math.floor(baseCost * Math.pow(2, level)); // Increased cost multiplier
        const effect = baseEffect * (level + 1);

        console.log(`Attempting to buy ${name}. Cost: ${currentCost}, Current Cookies: ${cookieCount}`);

        if (cookieCount >= currentCost) {
            cookieCount -= currentCost;
            cookiesPerClick += effect;
            upgradeLevels[name] = level + 1;

            console.log(`Bought ${name}. New Cookies per Click: ${cookiesPerClick}`);
            
            updateUI();
            saveGame();
        } else {
            alert('Not enough cookies!');
        }
    });
});

// Event listener for admin login button
adminLoginButton.addEventListener('click', () => {
    adminPopup.style.display = 'block'; // Show the popup
});

// Event listener for login button in admin popup
loginButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'marco' && password === '1797') {
        adminPopup.style.display = 'none'; // Hide the popup
        adminMenu.style.display = 'block'; // Show the admin menu
    } else {
        alert('Invalid username or password');
    }
});

// Event listener for cancel button in admin popup
cancelButton.addEventListener('click', () => {
    adminPopup.style.display = 'none'; // Hide the popup
});

// Event listener for remove cookies button
removeCookiesButton.addEventListener('click', () => {
    const amount = parseInt(removeCookiesInput.value);
    cookieCount = Math.max(0, cookieCount - amount);
    updateUI();
    saveGame();
});

// Event listener for set cookies button
setCookiesButton.addEventListener('click', () => {
    const amount = parseInt(setCookiesInput.value);
    cookieCount = amount;
    updateUI();
    saveGame();
});
