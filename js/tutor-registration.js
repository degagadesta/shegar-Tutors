// Handle tutor registration form
document.getElementById('tutorRegistrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        education: document.getElementById('education').value,
        institution: document.getElementById('institution').value,
        major: document.getElementById('major').value,
        subjects: Array.from(document.getElementById('subjects').selectedOptions).map(opt => opt.value),
        gradeLevels: Array.from(document.getElementById('gradeLevels').selectedOptions).map(opt => opt.value),
        experience: document.getElementById('experience').value,
        locations: Array.from(document.getElementById('locations').selectedOptions).map(opt => opt.value),
        availability: document.getElementById('availability').value,
        hourlyRate: parseInt(document.getElementById('hourlyRate').value),
        bio: document.getElementById('bio').value
    };

    // Validate form
    if (formData.subjects.length === 0 || formData.gradeLevels.length === 0 || formData.locations.length === 0) {
        displayMessage('Please select at least one subject, grade level, and location', 'error');
        return;
    }

    // Register tutor
    const newTutor = shegarTutors.registerTutor(formData);
    
    displayMessage('Tutor application submitted successfully! We will review your application and contact you soon.');
    
    // Reset form
    this.reset();
    
    // Redirect to home page after 3 seconds
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 3000);
});