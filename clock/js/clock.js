// Default time zones
const defaultTimeZones = [
    { name: 'London', offset: 0 },
    { name: 'New York', offset: -5 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Sydney', offset: 10 },
    { name: 'Dubai', offset: 4 },
    { name: 'Singapore', offset: 8 }
];

let customTimeZones = [];
let settings = {
    showSeconds: true,
    showDate: true,
    showOffset: true,
    textColor: '#66fcf1',
    bgColor: '#0b0c10'
};

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    renderClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
});

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('clockSettings');
    const savedTimezones = localStorage.getItem('customTimeZones');
    
    if (saved) {
        settings = JSON.parse(saved);
        document.getElementById('show-seconds').checked = settings.showSeconds;
        document.getElementById('show-date').checked = settings.showDate;
        document.getElementById('show-offset').checked = settings.showOffset;
        document.getElementById('text-color').value = settings.textColor;
        document.getElementById('bg-color').value = settings.bgColor;
        applyCustomColors();
    }
    
    if (savedTimezones) {
        customTimeZones = JSON.parse(savedTimezones);
    }
}

// Render clock cards
function renderClocks() {
    const container = document.getElementById('timezonesContainer');
    container.innerHTML = '';
    
    const allZones = [...defaultTimeZones, ...customTimeZones];
    
    allZones.forEach((zone, index) => {
        const isCustom = index >= defaultTimeZones.length;
        const card = document.createElement('div');
        card.className = 'timezone-card';
        card.innerHTML = `
            <div class="timezone-name">${zone.name}</div>
            <div class="timezone-time" id="time-${index}">00:00:00</div>
            <div class="timezone-date" id="date-${index}"></div>
            <div class="timezone-offset" id="offset-${index}">UTC${zone.offset >= 0 ? '+' : ''}${zone.offset}</div>
            ${isCustom ? `<button class="timezone-remove" onclick="removeTimezone(${index})">Remove</button>` : ''}
        `;
        container.appendChild(card);
    });
}

// Update all clocks
function updateClocks() {
    const allZones = [...defaultTimeZones, ...customTimeZones];
    const now = new Date();
    
    allZones.forEach((zone, index) => {
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const zoneTime = new Date(utcTime + zone.offset * 3600000);
        
        // Update time
        const timeFormat = document.getElementById('time-format').value;
        const timeElement = document.getElementById(`time-${index}`);
        
        if (timeElement) {
            if (settings.showSeconds || timeFormat === '24') {
                if (timeFormat === '24') {
                    timeElement.textContent = zoneTime.toLocaleTimeString('en-US', { 
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                } else {
                    timeElement.textContent = zoneTime.toLocaleTimeString('en-US', { 
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                }
            } else {
                if (timeFormat === '24') {
                    timeElement.textContent = zoneTime.toLocaleTimeString('en-US', { 
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    timeElement.textContent = zoneTime.toLocaleTimeString('en-US', { 
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
        }
        
        // Update date
        const dateElement = document.getElementById(`date-${index}`);
        if (dateElement && settings.showDate) {
            dateElement.textContent = zoneTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else if (dateElement) {
            dateElement.textContent = '';
        }
        
        // Update offset
        const offsetElement = document.getElementById(`offset-${index}`);
        if (offsetElement && settings.showOffset) {
            const sign = zone.offset >= 0 ? '+' : '';
            const hours = Math.floor(Math.abs(zone.offset));
            const minutes = (Math.abs(zone.offset) % 1) * 60;
            offsetElement.textContent = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else if (offsetElement) {
            offsetElement.textContent = '';
        }
    });
}

// Add custom timezone
function addCustomTimezone() {
    const name = document.getElementById('tz-name').value.trim();
    const offset = parseFloat(document.getElementById('tz-offset').value);
    
    if (!name) {
        alert('Please enter a name for the timezone');
        return;
    }
    
    const exists = [...defaultTimeZones, ...customTimeZones].some(z => z.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert('This timezone name already exists');
        return;
    }
    
    customTimeZones.push({ name, offset });
    document.getElementById('tz-name').value = '';
    document.getElementById('tz-offset').value = '0';
    
    renderClocks();
    updateClocks();
    saveSettings();
}

// Remove timezone
function removeTimezone(index) {
    const allZones = [...defaultTimeZones, ...customTimeZones];
    if (index >= defaultTimeZones.length) {
        customTimeZones.splice(index - defaultTimeZones.length, 1);
        renderClocks();
        updateClocks();
        saveSettings();
    }
}

// Reset to default
function resetToDefault() {
    if (confirm('Remove all custom timezones and reset to default?')) {
        customTimeZones = [];
        renderClocks();
        updateClocks();
        saveSettings();
    }
}

// Toggle admin panel
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

// Apply custom colors
function applyCustomColors() {
    settings.textColor = document.getElementById('text-color').value;
    settings.bgColor = document.getElementById('bg-color').value;
    
    document.documentElement.style.setProperty('--text-color', settings.textColor);
    document.documentElement.style.setProperty('--bg-color', settings.bgColor);
}

// Change theme
function changeTheme(theme) {
    document.body.className = '';
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'neon') {
        document.body.classList.add('neon-theme');
    }
    localStorage.setItem('clockTheme', theme);
}

// Save settings
function saveSettings() {
    settings.showSeconds = document.getElementById('show-seconds').checked;
    settings.showDate = document.getElementById('show-date').checked;
    settings.showOffset = document.getElementById('show-offset').checked;
    
    localStorage.setItem('clockSettings', JSON.stringify(settings));
    localStorage.setItem('customTimeZones', JSON.stringify(customTimeZones));
    
    alert('✓ Settings saved!');
    updateClocks();
}

// Reset all settings
function resetSettings() {
    if (confirm('Reset all settings to default?')) {
        localStorage.removeItem('clockSettings');
        localStorage.removeItem('customTimeZones');
        localStorage.removeItem('clockTheme');
        
        settings = {
            showSeconds: true,
            showDate: true,
            showOffset: true,
            textColor: '#66fcf1',
            bgColor: '#0b0c10'
        };
        customTimeZones = [];
        
        document.getElementById('show-seconds').checked = true;
        document.getElementById('show-date').checked = true;
        document.getElementById('show-offset').checked = true;
        document.getElementById('text-color').value = '#66fcf1';
        document.getElementById('bg-color').value = '#0b0c10';
        document.getElementById('theme-select').value = 'dark';
        document.body.className = '';
        
        applyCustomColors();
        renderClocks();
        updateClocks();
        
        alert('✓ Settings reset to default!');
    }
}