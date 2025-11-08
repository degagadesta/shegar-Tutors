// Handle requirement form submission
document.getElementById('requirementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        studentGrade: document.getElementById('studentGrade').value,
        subjects: Array.from(document.getElementById('subjects').selectedOptions).map(opt => opt.value),
        location: document.getElementById('location').value,
        schedule: document.getElementById('schedule').value,
        budget: document.getElementById('budget').value,
        specificRequirements: document.getElementById('requirements').value,
        parentName: document.getElementById('parentName').value,
        parentEmail: document.getElementById('parentEmail').value,
        parentPhone: document.getElementById('parentPhone').value
    };

    // Validate form
    if (!formData.studentGrade || formData.subjects.length === 0 || !formData.location) {
        displayMessage('Please fill all required fields', 'error');
        return;
    }

    // Add requirement to system
    const newRequirement = shegarTutors.addRequirement(formData);
    
    displayMessage('Requirement posted successfully! Tutors will now be able to apply.');
    
    // Reset form
    this.reset();
    
    // Redirect to requirements page after 2 seconds
    setTimeout(() => {
        window.location.href = '../pages/requirements.html';
    }, 2000);
});

// Load and display requirements
function loadRequirements() {
    const requirements = shegarTutors.getRequirements();
    const container = document.getElementById('requirementsContainer');
    
    if (!container) return;
    
    if (requirements.length === 0) {
        container.innerHTML = `
            <div class="no-requirements">
                <h3>No open requirements at the moment</h3>
                <p>Be the first to post a tutoring requirement!</p>
                <a href="post-requirement.html" class="btn btn-primary">Post a Requirement</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requirements.map(requirement => `
        <div class="requirement-card">
            <div class="requirement-header">
                <div class="requirement-subject">
                    ${requirement.subjects.join(', ')} - ${requirement.studentGrade}
                </div>
                <div class="requirement-budget">
                    ${requirement.budget} ETB/hr
                </div>
            </div>
            
            <div class="requirement-details">
                <div class="requirement-detail">
                    <i>📍</i> ${requirement.location}
                </div>
                <div class="requirement-detail">
                    <i>🕐</i> ${requirement.schedule}
                </div>
                <div class="requirement-detail">
                    <i>👥</i> ${requirement.applicants.length} applicants
                </div>
                <div class="requirement-detail">
                    <i>📅</i> Posted ${formatDate(requirement.postedDate)}
                </div>
            </div>
            
            ${requirement.specificRequirements ? `
                <div class="requirement-notes">
                    <strong>Notes:</strong> ${requirement.specificRequirements}
                </div>
            ` : ''}
            
            <div class="requirement-actions">
                <button onclick="applyForRequirement(${requirement.id})" class="btn btn-primary" style="width: 100%;">
                    Apply for this Requirement
                </button>
            </div>
        </div>
    `).join('');
}

// Apply for requirement
function applyForRequirement(requirementId) {
    // Check if tutor is registered
    const tutors = JSON.parse(localStorage.getItem('tutors')) || [];
    if (tutors.length === 0) {
        displayMessage('Please register as a tutor first', 'error');
        setTimeout(() => {
            window.location.href = 'auth/tutor-signup.html';
        }, 2000);
        return;
    }
    
    // For demo, use the first tutor
    const tutorId = tutors[0].id;
    
    const applicationData = {
        tutorName: tutors[0].fullName,
        message: `I am interested in this tutoring position and believe my qualifications are a good match.`
    };
    
    shegarTutors.submitApplication(requirementId, tutorId, applicationData);
    displayMessage('Application submitted successfully!');
}

// Load requirements when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadRequirements();
});