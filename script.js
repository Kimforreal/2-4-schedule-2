import { firestore, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from './firebase-config.js';

const PASSWORD = '1014'; // 비밀번호 설정
const PASSWORD_FIELD_ID = 'passwordInput';
const SCHEDULE_CONTAINER_ID = 'scheduleContainer';
const ADD_EVENT_BUTTON_ID = 'addEventButton';

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
});

function initializeUI() {
    // 기본적으로 버튼과 스케줄 컨테이너를 숨깁니다
    document.getElementById(SCHEDULE_CONTAINER_ID).style.display = 'none';
    document.getElementById(ADD_EVENT_BUTTON_ID).style.display = 'none';
    generateDates();
}

function verifyPassword() {
    const password = document.getElementById(PASSWORD_FIELD_ID).value;
    if (password === PASSWORD) {
        // 비밀번호가 맞으면 인증 섹션을 숨기고, 스케줄 컨테이너와 버튼을 보이게 합니다
        document.getElementById('authSection').style.display = 'none';
        document.getElementById(SCHEDULE_CONTAINER_ID).style.display = 'block';
        document.getElementById(ADD_EVENT_BUTTON_ID).style.display = 'inline'; // 버튼 보이기
        generateDates();
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
}

async function generateDates() {
    const querySnapshot = await getDocs(collection(firestore, 'events'));
    const datesDiv = document.getElementById('dates');
    datesDiv.innerHTML = '';
    querySnapshot.forEach(doc => {
        const data = doc.data();
        const date = doc.id;
        const events = data.events || [];

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date-entry');
        dateDiv.innerHTML = `<strong>&#8226; ${date}</strong>`; // 큰 점 추가
        
        events.forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event-item');
            eventDiv.innerHTML = `${event}
                <div class="event-buttons">
                    ${document.getElementById(ADD_EVENT_BUTTON_ID).style.display === 'inline'
                        ? `<button onclick="openEditEventModal('${date}', ${index})">수정</button>
                           <button onclick="openDeleteEventModal('${date}', ${index})">삭제</button>`
                        : ''}
                </div>`;
            dateDiv.appendChild(eventDiv);
        });

        datesDiv.appendChild(dateDiv);
    });
}

async function saveNewEvent() {
    const date = document.getElementById('addEventDate').value;
    const details = document.getElementById('addEventDetails').value;
    if (!date || !details) {
        alert('날짜와 일정을 입력하세요.');
        return;
    }

    const eventsRef = doc(firestore, 'events', date);
    const eventData = (await getDocs(collection(firestore, 'events', date))).docs.map(doc => doc.data()) || { events: [] };
    
    eventData.events.push(details);
    
    await updateDoc(eventsRef, { events: eventData.events });
    closeModal('addEventModal');
    generateDates();
}

async function updateEvent() {
    const date = document.getElementById('editEventDate').value;
    const details = document.getElementById('editEventDetails').value;
    const index = document.getElementById('editEventIndex').value;
    if (!date || details === undefined) {
        alert('날짜와 일정을 입력하세요.');
        return;
    }

    const eventsRef = doc(firestore, 'events', date);
    const eventData = (await getDocs(collection(firestore, 'events', date))).docs.map(doc => doc.data()) || { events: [] };
    
    eventData.events[index] = details;
    
    await updateDoc(eventsRef, { events: eventData.events });
    closeModal('editEventModal');
    generateDates();
}

async function confirmDeleteEvent() {
    const date = document.getElementById('deleteEventDate').value;
    const index = document.getElementById('deleteEventIndex').value;

    const eventsRef = doc(firestore, 'events', date);
    const eventData = (await getDocs(collection(firestore, 'events', date))).docs.map(doc => doc.data()) || { events: [] };
    
    eventData.events.splice(index, 1);
    
    if (eventData.events.length === 0) {
        await deleteDoc(eventsRef);
    } else {
        await updateDoc(eventsRef, { events: eventData.events });
    }

    closeModal('deleteEventModal');
    generateDates();
}

function openEditEventModal(date, index) {
    document.getElementById('editEventDate').value = date;
    document.getElementById('editEventIndex').value = index;
    document.getElementById('editEventDetails').value = document.querySelector(`.date-entry[date="${date}"] .event-item:nth-child(${index + 1})`).innerText.trim();
    openModal('editEventModal');
}

function openDeleteEventModal(date, index) {
    document.getElementById('deleteEventDate').value = date;
    document.getElementById('deleteEventIndex').value = index;
    document.getElementById('deleteEventMessage').innerText = `정말로 ${date}의 일정을 삭제하시겠습니까?`;
    openModal('deleteEventModal');
}

function openAddEventModal() {
    openModal('addEventModal');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
