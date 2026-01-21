/* API Endpoints */
const API_BASE = 'https://www.fulek.com/data/api/supit';
const ENDPOINTS = {
    list: `${API_BASE}/curriculum-list/en`,
    get: (id) => `${API_BASE}/get-curriculum/${id}`
};

/* State */
let allCourses = [];
let selectedCourses = [];

/* Initialize */
function initCurriculum() {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        alert('Access denied. Please login first.');
        window.location.href = '../pages/login.html';
        return;
    }

    loadCourses(token);
    initAutocomplete();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurriculum);
} else {
    initCurriculum();
}

function loadCourses(token) {
    fetch(ENDPOINTS.list, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    alert('Session expired. Please login again.');
                    localStorage.removeItem('jwt_token');
                    window.location.href = '../pages/login.html';
                }
                throw new Error(`Failed to fetch courses: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                allCourses = data;
            } else if (data && Array.isArray(data.data)) {
                allCourses = data.data;
            } else {
                allCourses = [];
            }
        })
        .catch(err => {
            console.error(err);
            const container = document.querySelector('.curriculum-container');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = 'Failed to load curriculum data.';
            container.insertBefore(errorDiv, container.firstChild);
        });
}

function initAutocomplete() {
    const input = document.getElementById('course-search');
    const listContainer = document.getElementById('autocomplete-list');

    input.addEventListener('input', function () {
        const val = this.value.toLowerCase();
        listContainer.innerHTML = '';

        if (!val || val.length < 2) return;
        if (allCourses.length === 0) return;

        const matches = allCourses.filter(c => c.course && c.course.toLowerCase().includes(val));

        if (matches.length === 0) {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.style.color = '#999';
            item.style.cursor = 'default';
            item.textContent = 'No courses found';
            listContainer.appendChild(item);
            return;
        }

        matches.forEach(course => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = course.course;
            item.addEventListener('click', () => {
                input.value = course.course;
                listContainer.innerHTML = '';
                displayCourseDetails(course);
            });
            listContainer.appendChild(item);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== listContainer) {
            listContainer.innerHTML = '';
        }
    });
}

function displayCourseDetails(course) {
    const detailsContainer = document.getElementById('course-details');
    detailsContainer.style.display = 'block';

    /* Map Keys */
    const displayName = course.course || course.kolegij;
    const displayEcts = course.ects;
    const displayHours = course.hours ?? course.sati;
    const displayLectures = course.lectures ?? course.predavanja;
    const displayExercises = course.exercises ?? course.vjezbe;
    const displaySemester = course.semester ?? course.semestar;
    const displayType = course.type || course.tip;

    detailsContainer.innerHTML = `
    <h3>${displayName}</h3>
    <div class="course-info-grid">
      <div class="info-item"><label>ECTS</label><span>${displayEcts}</span></div>
      <div class="info-item"><label>Hours</label><span>${displayHours}</span></div>
      <div class="info-item"><label>Lectures</label><span>${displayLectures}</span></div>
      <div class="info-item"><label>Exercises</label><span>${displayExercises}</span></div>
      <div class="info-item"><label>Semester</label><span>${displaySemester}</span></div>
      <div class="info-item"><label>Type</label><span>${displayType}</span></div>
    </div>
    <button class="add-course-btn" id="add-btn">Add to Curriculum</button>
  `;

    document.getElementById('add-btn').onclick = () => addCourseToTable(course);
}

function addCourseToTable(course) {
    const normalizedCourse = {
        id: course.id,
        course: course.course || course.kolegij,
        ects: course.ects,
        hours: course.hours || course.sati,
        lectures: course.lectures || course.predavanja,
        exercises: course.exercises || course.vjezbe,
        semester: course.semester || course.semestar,
        type: course.type || course.tip
    };

    if (selectedCourses.some(c => c.id === normalizedCourse.id)) {
        alert('Course already added!');
        return;
    }

    selectedCourses.push(normalizedCourse);
    renderTable();

    document.getElementById('course-search').value = '';
    document.getElementById('course-details').style.display = 'none';
}

function removeCourse(id) {
    selectedCourses = selectedCourses.filter(c => c.id !== id);
    renderTable();
}

function renderTable() {
    const tbody = document.querySelector('#curriculum-table tbody');

    tbody.innerHTML = '';

    let totalEcts = 0;
    let totalHours = 0;

    selectedCourses.forEach(course => {
        totalEcts += course.ects;
        totalHours += course.hours;

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${course.course}</td>
      <td>${course.ects}</td>
      <td>${course.hours}</td>
      <td>${course.semester}</td>
      <td><button class="remove-btn" onclick="removeCourse(${course.id})">Remove</button></td>
    `;
        tbody.appendChild(tr);
    });

    document.getElementById('total-ects').textContent = totalEcts;
    document.getElementById('total-hours').textContent = totalHours;

    if (selectedCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#999;">No courses selected</td></tr>';
    }
}
