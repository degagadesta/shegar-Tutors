// Initialize the application
class ShegarTutors {
    constructor() {
        this.requirements = JSON.parse(localStorage.getItem('requirements')) || [];
        this.tutors = JSON.parse(localStorage.getItem('tutors')) || [];
        this.parents = JSON.parse(localStorage.getItem('parents')) || [];
        this.applications = JSON.parse(localStorage.getItem('applications')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        console.log('Shegar Tutors initialized');
    }

    // Requirement Management
    addRequirement(requirementData) {
        const newRequirement = {
            id: Date.now(),
            ...requirementData,
            status: 'open',
            postedDate: new Date().toISOString(),
            applicants: []
        };
        
        this.requirements.push(newRequirement);
        this.saveToLocalStorage();
        return newRequirement;
    }

    getRequirements() {
        return this.requirements.filter(req => req.status === 'open');
    }

    // Tutor Management
    registerTutor(tutorData) {
        const newTutor = {
            id: Date.now(),
            ...tutorData,
            status: 'pending',
            registrationDate: new Date().toISOString()
        };
        
        this.tutors.push(newTutor);
        this.saveToLocalStorage();
        return newTutor;
    }

    // Application Management
    submitApplication(requirementId, tutorId, applicationData) {
        const application = {
            id: Date.now(),
            requirementId: parseInt(requirementId),
            tutorId: parseInt(tutorId),
            ...applicationData,
            applicationDate: new Date().toISOString(),
            status: 'pending'
        };
        
        this.applications.push(application);
        
        // Add tutor to requirement's applicants
        const requirement = this.requirements.find(req => req.id === parseInt(requirementId));
        if (requirement) {
            requirement.applicants.push(tutorId);
        }
        
        this.saveToLocalStorage();
        return application;
    }

    getApplicationsForRequirement(requirementId) {
        return this.applications.filter(app => app.requirementId === parseInt(requirementId));
    }

    // Admin Functions
    approveTutor(tutorId) {
        const tutor = this.tutors.find(t => t.id === tutorId);
        if (tutor) {
            tutor.status = 'approved';
            this.saveToLocalStorage();
        }
    }

    selectTutorForRequirement(requirementId, tutorId) {
        const requirement = this.requirements.find(req => req.id === requirementId);
        if (requirement) {
            requirement.status = 'filled';
            requirement.selectedTutor = tutorId;
            this.saveToLocalStorage();
        }
    }

    // Utility Functions
    saveToLocalStorage() {
        localStorage.setItem('requirements', JSON.stringify(this.requirements));
        localStorage.setItem('tutors', JSON.stringify(this.tutors));
        localStorage.setItem('parents', JSON.stringify(this.parents));
        localStorage.setItem('applications', JSON.stringify(this.applications));
    }

    setupEventListeners() {
        // Global event listeners can be added here
    }

    loadDashboardData() {
        // Load data for admin dashboard
    }
}

// Initialize the app
const shegarTutors = new ShegarTutors();

// Utility Functions
function displayMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#2E8B57' : '#dc3545'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
