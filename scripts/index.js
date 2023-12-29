// Fetch the data and load to localStorage
fetch('./data/lectures.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('lectures', JSON.stringify(data));
    })
    .catch(error => console.error('Error fetching courses:', error));

// Sets the inner.HTML for Student Management and loads the json data to localStorage
function loadStudentManagement() {
    mainContent.innerHTML = `
        <div class='card' id='view-students' >View Students</div>
        <div class='card' id='add-student' >Add Student</div>
        <div class='card' id='delete-student' >Delete Student</div>
    `;
}

// Calculates the letter grade of given curse according to course Final & Midterm rate
function calculateLetterGrade(course, current_midterm, current_final){
    /*  90-100 A
        80-89 B
        70-79 C
        60-69 D
        0-59  F */
    final_rate = course.final;
    midterm_rate = course.midterm;

    grade = (current_midterm * (midterm_rate/100)) + (current_final * (final_rate/100));
    if (90 <= grade < 100){
        return 'A';
    } else if (80 <= grade <= 89) {
        return 'B'
    } else if (70 <= grade <= 79) {
        return 'C'
    } else if (60 <= grade <= 69) {
        return 'D'
    } else {
        return 'F'
    }
}

// Set event listener for Manage Student element
document.getElementById('manage-students').addEventListener('click', loadStudentManagement);

// Set event listener for Manage Courses element
document.getElementById('manage-courses').addEventListener('click', loadCourseManagement);



