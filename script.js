let interviewList = [];
let rejectedList = [];
let currentFilter = 'filter-all';

let emptyState = document.getElementById('emptyState');

let totalApplications = document.getElementById("totalApplications");
let interviewTotal = document.getElementById("interviewTotal");
let rejectedTotal = document.getElementById("rejectedTotal");
let jobCounter = document.getElementById('jobCounter');

const filterAllBtn = document.getElementById('filter-all');
const filterInterviewBtn = document.getElementById('filter-interview');
const filterRejectedBtn = document.getElementById('filter-rejected');

const jobList = document.getElementById('jobList');
const mainArea = document.querySelector('main');
const filteredList = document.getElementById('filteredList');

function updateCounts() {
    totalApplications.innerText = jobList.children.length;
    jobCounter.innerText = jobList.children.length;
    interviewTotal.innerText = interviewList.length;
    rejectedTotal.innerText = rejectedList.length;
}

function updateCounterText() {
    if (currentFilter === 'filter-all') {
        jobCounter.innerText = jobList.children.length;
    } else if (currentFilter === 'filter-interview') {
        jobCounter.innerText = `${interviewList.length} of ${jobList.children.length}`;
    } else if (currentFilter === 'filter-rejected') {
        jobCounter.innerText = `${rejectedList.length} of ${jobList.children.length}`;
    }
}

updateCounts();
updateCounterText();

function toggleStyle(id) {

    filterAllBtn.classList.remove('bg-blue-700', 'text-white');
    filterInterviewBtn.classList.remove('bg-blue-700', 'text-white');
    filterRejectedBtn.classList.remove('bg-blue-700', 'text-white');

    filterAllBtn.classList.add('bg-white', 'text-gray-600');
    filterInterviewBtn.classList.add('bg-white', 'text-gray-600');
    filterRejectedBtn.classList.add('bg-white', 'text-gray-600');

    const selected = document.getElementById(id);
    currentFilter = id;

    selected.classList.remove('bg-white', 'text-gray-600');
    selected.classList.add('bg-blue-700', 'text-white');

    emptyState.classList.add('hidden');
    filteredList.innerHTML = '';

    if (id === 'filter-interview') {
        jobList.classList.add('hidden');
        filteredList.classList.remove('hidden');
        jobCounter.innerText = `${interviewList.length} of ${jobList.children.length}`;

        if (interviewList.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            renderInterview();
        }
    }

    else if (id === 'filter-rejected') {
        jobList.classList.add('hidden');
        filteredList.classList.remove('hidden');
        jobCounter.innerText = `${rejectedList.length} of ${jobList.children.length}`;

        if (rejectedList.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            renderRejected();
        }
    }

    else {
        jobList.classList.remove('hidden');
        filteredList.classList.add('hidden');
        jobCounter.innerText = jobList.children.length;
        emptyState.classList.add('hidden');
    }
}

mainArea.addEventListener('click', function (event) {

    if (event.target.classList.contains('btn-interview')) {

        const parent = event.target.closest('.job-card');
        const company = parent.querySelector('.company-title').innerText;
        const role = parent.querySelector('.role-title').innerText;
        const meta = parent.querySelector('.job-meta').innerText;
        const description = parent.querySelector('.job-description').innerText;

        const statusEl = parent.querySelector('.job-status');
        statusEl.innerText = 'INTERVIEW';
        statusEl.className = "job-status sm:w-1/2 lg:max-w-[15%] text-green-500 bg-green-100 border border-green-500 rounded-md px-4 py-2";

        const data = { company, role, meta, status: 'INTERVIEW', description };

        if (!interviewList.find(item => item.company === company)) {
            interviewList.push(data);
        }

        rejectedList = rejectedList.filter(item => item.company !== company);

        updateCounts();
        updateCounterText();

        if (currentFilter === 'filter-rejected') {
            if (rejectedList.length === 0) {
                filteredList.innerHTML = '';
                emptyState.classList.remove('hidden');
            } else {
                renderRejected();
            }
        }
    }

    else if (event.target.classList.contains('btn-reject')) {

        const parent = event.target.closest('.job-card');
        const company = parent.querySelector('.company-title').innerText;
        const role = parent.querySelector('.role-title').innerText;
        const meta = parent.querySelector('.job-meta').innerText;
        const description = parent.querySelector('.job-description').innerText;

        const statusEl = parent.querySelector('.job-status');
        statusEl.innerText = 'REJECTED';
        statusEl.className = "job-status sm:w-1/2 lg:max-w-[15%] text-red-500 bg-red-100 border border-red-500 rounded-md px-4 py-2";

        const data = { company, role, meta, status: 'REJECTED', description };

        if (!rejectedList.find(item => item.company === company)) {
            rejectedList.push(data);
        }

        interviewList = interviewList.filter(item => item.company !== company);

        updateCounts();
        updateCounterText();

        if (currentFilter === 'filter-interview') {
            if (interviewList.length === 0) {
                filteredList.innerHTML = '';
                emptyState.classList.remove('hidden');
            } else {
                renderInterview();
            }
        }
    }

    else if (event.target.closest('.btn-remove')) {

        const card = event.target.closest('.job-card');
        const company = card.querySelector('.company-title').innerText;

        interviewList = interviewList.filter(item => item.company !== company);
        rejectedList = rejectedList.filter(item => item.company !== company);

        if (currentFilter === 'filter-all') {
            card.remove();
        } else {
            const original = [...jobList.children].find(c =>
                c.querySelector('.company-title').innerText === company
            );
            if (original) {
                const statusEl = original.querySelector('.job-status');
                statusEl.innerText = 'NOT APPLIED';
                statusEl.className = "job-status bg-blue-100 sm:w-1/2 lg:max-w-[15%] p-2 rounded-md";
            }

            if (currentFilter === 'filter-interview') {
                renderInterview();
                if (interviewList.length === 0) emptyState.classList.remove('hidden');
            }

            if (currentFilter === 'filter-rejected') {
                renderRejected();
                if (rejectedList.length === 0) emptyState.classList.remove('hidden');
            }
        }

        updateCounts();
        updateCounterText();
    }
});

function renderInterview() {
    filteredList.innerHTML = '';

    interviewList.forEach(item => {
        const div = document.createElement('div');
        div.className = "job-card flex justify-between bg-white p-4 my-4 rounded-md";
        div.innerHTML = `
            <div class="space-y-6">
                <div>
                    <p class="company-title font-bold">${item.company}</p>
                    <p class="role-title text-gray-400">${item.role}</p>
                </div>
                <div>
                    <p class="job-meta text-gray-400">${item.meta}</p>
                </div>
                <p class="job-status sm:w-1/2 lg:max-w-[15%] text-green-500 bg-green-100 border border-green-500 rounded-md px-4 py-2">${item.status}</p>
                <p class="job-description">${item.description}</p>
                <div class="flex gap-5">
                    <button class="btn-interview text-green-500 border border-green-500 rounded-md px-4 py-2 hover:bg-green-200">INTERVIEW</button>
                    <button class="btn-reject text-red-500 border border-red-500 rounded-md px-4 py-2 hover:bg-red-200">REJECTED</button>
                </div>
            </div>
            <div>
                <button class="btn-remove">
                    <img src="deletepic.png" class="w-16 h-12 sm:w-1 sm:h-12 lg:w-10 lg:h-10">
                </button>
            </div>
        `;
        filteredList.appendChild(div);
    });
}

function renderRejected() {
    filteredList.innerHTML = '';

    rejectedList.forEach(item => {
        const div = document.createElement('div');
        div.className = "job-card flex justify-between bg-white p-4 my-4 rounded-md";
        div.innerHTML = `
            <div class="space-y-6">
                <div>
                    <p class="company-title font-bold">${item.company}</p>
                    <p class="role-title text-gray-400">${item.role}</p>
                </div>
                <div>
                    <p class="job-meta text-gray-400">${item.meta}</p>
                </div>
                <p class="job-status sm:w-1/2 lg:max-w-[15%] text-red-500 bg-red-100 border border-red-500 rounded-md px-4 py-2">${item.status}</p>
                <p class="job-description">${item.description}</p>
                <div class="flex gap-5">
                    <button class="btn-interview text-green-500 border border-green-500 rounded-md px-4 py-2 hover:bg-green-200">INTERVIEW</button>
                    <button class="btn-reject text-red-500 border border-red-500 rounded-md px-4 py-2 hover:bg-red-200">REJECTED</button>
                </div>
            </div>
            <div>
                <button class="btn-remove">
                    <img src="deletepic.png" class="w-16 h-12 sm:w-1 sm:h-12 lg:w-10 lg:h-10">
                </button>
            </div>
        `;
        filteredList.appendChild(div);
    });
}