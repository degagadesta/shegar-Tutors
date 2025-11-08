// Admin Dashboard Functions
class AdminDashboard {
    constructor() {
        this.shegarTutors = new ShegarTutors();
        this.init();
    }

    init() {
        this.loadStatistics();
        this.loadRecentRequirements();
        this.loadPendingTutors();
        this.loadRequirementsWithApplications();
    }

    loadStatistics() {
        const requirements = this.shegarTutors.requirements;
        const tutors = this.shegarTutors.tutors;
        const applications = this.shegarTutors.applications;

        document.getElementById('totalRequirements').textContent = requirements.length;
        document.getElementById('openRequirements').textContent = requirements.filter(req => req.status === 'open').length;
        document.getElementById('totalTutors').textContent = tutors.length;
        document.getElementById('pendingApplications').textContent = applications.filter(app => app.status === 'pending').length;
    }

    loadRecentRequirements() {
        const requirements = this.shegarTutors.requirements.slice(-5).reverse(); // Last 5 requirements
        const container = document.getElementById('recentRequirements');
        
        if (requirements.length === 0) {
            container.innerHTML = '<p>No requirements posted yet.</p>';
            return;
        }

        container.innerHTML = requirements.map(req => `
            <div class="requirement-card">
                <div class="requirement-header">
                    <div class="requirement-subject">
                        ${req.subjects.join(', ')} - ${req.studentGrade}
                    </div>
                    <div class="requirement-budget">
                        ${req.budget} ETB/hr
                    </div>
                </div>
                <div class="requirement-details">
                    <div class="requirement-detail">
                        <i>📍</i> ${req.location}
                    </div>
                    <div class="requirement-detail">
                        <i>👥</i> ${req.applicants.length} applicants
                    </div>
                    <div class="requirement-detail">
                        <i>📅</i> ${formatDate(req.postedDate)}
                    </div>
                </div>
                <div class="requirement-actions">
                    <button onclick="viewRequirementDetails(${req.id})" class="btn btn-primary" style="width: 100%;">
                        View Applications
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadPendingTutors() {
        const pendingTutors = this.shegarTutors.tutors.filter(tutor => tutor.status === 'pending');
        const container = document.getElementById('pendingTutors');
        
        if (pendingTutors.length === 0) {
            container.innerHTML = '<p>No pending tutor applications.</p>';
            return;
        }

        container.innerHTML = pendingTutors.map(tutor => `
            <div class="tutor-card">
                <h3>${tutor.fullName}</h3>
                <p><strong>Education:</strong> ${tutor.education} in ${tutor.major}</p>
                <p><strong>Institution:</strong> ${tutor.institution}</p>
                <p><strong>Subjects:</strong> ${tutor.subjects.join(', ')}</p>
                <p><strong>Experience:</strong> ${tutor.experience}</p>
                <p><strong>Expected Rate:</strong> ${tutor.hourlyRate} ETB/hr</p>
                <div class="tutor-actions">
                    <button onclick="approveTutor(${tutor.id})" class="btn btn-primary">Approve</button>
                    <button onclick="viewTutorDetails(${tutor.id})" class="btn btn-secondary">View Details</button>
                </div>
            </div>
        `).join('');
    }

    loadRequirementsWithApplications() {
        const requirements = this.shegarTutors.requirements.filter(req => req.applicants.length > 0);
        const container = document.getElementById('requirementsWithApplications');
        
        if (requirements.length === 0) {
            container.innerHTML = '<p>No requirements with applications yet.</p>';
            return;
        }

        container.innerHTML = requirements.map(req => {
            const applications = this.shegarTutors.getApplicationsForRequirement(req.id);
            return `
                <div class="requirement-card">
                    <div class="requirement-header">
                        <div class="requirement-subject">
                            ${req.subjects.join(', ')} - ${req.studentGrade}
                        </div>
                        <div class="application-count">
                            ${applications.length} Applications
                        </div>
                    </div>
                    <div class="applications-list">
                        ${applications.map(app => {
                            const tutor = this.shegarTutors.tutors.find(t => t.id === app.tutorId);
                            return tutor ? `
                                <div class="application-item">
                                    <strong>${tutor.fullName}</strong> - ${tutor.education} in ${tutor.major}
                                    <button onclick="selectTutor(${req.id}, ${tutor.id})" class="btn btn-primary btn-small">
                                        Select
                                    </button>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Admin Functions
function approveTutor(tutorId) {
    shegarTutors.approveTutor(tutorId);
    displayMessage('Tutor approved successfully!');
    // Reload the dashboard
    setTimeout(() => location.reload(), 1000);
}

function selectTutor(requirementId, tutorId) {
    shegarTutors.selectTutorForRequirement(requirementId, tutorId);
    displayMessage('Tutor selected for requirement!');
    // Reload the dashboard
    setTimeout(() => location.reload(), 1000);
}

function viewRequirementDetails(requirementId) {
    // Store requirement ID and redirect to details page
    localStorage.setItem('currentRequirementId', requirementId);
    window.location.href = 'requirement-details.html';
}

function viewTutorDetails(tutorId) {
    // Store tutor ID and redirect to tutor details page
    localStorage.setItem('currentTutorId', tutorId);
    window.location.href = 'tutor-details.html';
}

// Initialize admin dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    new AdminDashboard();
});