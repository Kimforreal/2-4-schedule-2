const PASSWORD = '1014';
const TWO_WEEKS = 14; // 2주

document.addEventListener('DOMContentLoaded', () => {
    generateDates();
});

function checkPassword() {
    const password = document.getElementById('password').value;
    if (password === PASSWORD) {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('scheduleContainer').style.display = 'block';
        document.getElementById('scheduleEditor').style.display = 'block';
        loadEvents();
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
                <button onclick="editEvent('${dateString}')">일정 추가/수정</button>
            </div>
        `;
    }
    document.getElementById('dates').innerHTML = dateHTML;
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    for (const [date, details] of Object.entries(events)) {
        const eventsContainer = document.getElementById(`events-${date}`);
        eventsContainer.innerHTML = details.map(detail => `<div>${detail}</div>`).join('');
    }
}

function addEvent() {
    const date = document.getElementById('newEventDate').value;
    const details = document.getElementById('newEventDetails').value;
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
    loadEvents();
    document.getElementById('newEventDate').value = '';
    document.getElementById('newEventDetails').value = '';
}

function editEvent(date) {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    const details = (events[date] || []).join('\n');
    document.getElementById('newEventDate').value = date;
    document.getElementById('newEventDetails').value = details;
}
