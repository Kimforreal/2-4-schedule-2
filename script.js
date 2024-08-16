const PASSWORD = '1014';
const TWO_WEEKS = 14; // 2주

document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        document.getElementById('scheduleContainer').style.display = 'block';
        generateDates();
    } else {
        document.getElementById('scheduleContainer').style.display = 'block';
        generateDates();
    }
});

function checkPassword() {
    const password = document.getElementById('password').value;
    if (password === PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('scheduleContainer').style.display = 'block';
        generateDates();
    } else {
        alert('비밀번호가 틀렸습니다.');
    }
}

function generateDates() {
    const today = new Date();
    let dateHTML = '';
    for (let i = 0; i < TWO_WEEKS; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        dateHTML += `
            <div class="date-entry">
                <strong>${dateString}</strong>
                <div id="events-${dateString}"></div>
                <div class="event-buttons">
                    ${localStorage.getItem('isAdmin') === 'true' ? `
                        <button onclick="openAddEventModal('${dateString}')">일정 추가</button>
                        <button onclick="openEditEventModal('${dateString}')">일정 수정</button>
                        <button onclick="deleteEvent('${dateString}')">삭제</button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    document.getElementById('dates').innerHTML = dateHTML;
    loadEvents();
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    for (const [date, details] of Object.entries(events)) {
        const eventsContainer = document.getElementById(`events-${date}`);
        eventsContainer.innerHTML = details.map(detail => `<div>${detail}</div>`).join('');
    }
}

function openAddEventModal(date) {
    document.getElementById('addEventDate').value = date;
    document.getElementById('addEventDetails').value = '';
    document.getElementById('editEventModal').style.display = 'none';
    document.getElementById('addEventModal').style.display = 'block';
}

function saveNewEvent() {
    const date = document.getElementById('addEventDate').value;
    const details = document.getElementById('addEventDetails').value;
    if (!date || !details) {
        alert('날짜와 일정을 입력하세요.');
        return;
    }

    let events = JSON.parse(localStorage.getItem('events')) || {};
    if (!events[date]) {
        events[date] = [];
    }
    events[date].push(details);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal('addEventModal');
    generateDates();
}

function openEditEventModal(date) {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    const details = (events[date] || []).join('\n');
    document.getElementById('editEventDate').value = date;
    document.getElementById('editEventDetails').value = details;
    document.getElementById('addEventModal').style.display = 'none';
    document.getElementById('editEventModal').style.display = 'block';
}

function updateEvent() {
    const date = document.getElementById('editEventDate').value;
    const details = document.getElementById('editEventDetails').value.split('\n');
    if (!date || !details.length) {
        alert('날짜와 일정을 입력하세요.');
        return;
    }

    let events = JSON.parse(localStorage.getItem('events')) || {};
    events[date] = details;
    localStorage.setItem('events', JSON.stringify(events));
    closeModal('editEventModal');
    generateDates();
}

function deleteEvent(date) {
    let events = JSON.parse(localStorage.getItem('events')) || {};
    delete events[date];
    localStorage.setItem('events', JSON.stringify(events));
    generateDates();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
