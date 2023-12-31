// Fetch the data and load to localStorage
fetch('./data/lectures.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('lectures', JSON.stringify(data));
    })
    .catch(error => console.error('Error fetching courses:', error));



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

// Returns the GPA of the student
function calculateGPA(student){
    // GPA: (grades * credits) / credits
    let takenCourses = [];
    let totalCredits = 0;
    let weightedGradesSum = 0;
    let allCourses = JSON.parse(localStorage.getItem('lectures'));

    // Find courses taken by the student and calculate total credits
    allCourses.forEach(course => {
        if (course.students.some(targetStudent => student.id === targetStudent.id)) {
            takenCourses.push(course);
            totalCredits += course.credits;
        }
    });

    // Calculate the weighted grade sum using a for loop
    for (let i = 0; i < takenCourses.length; i++) {
        let course = takenCourses[i];
        let studentCourseData = course.students.find(targetStudent => student.id === targetStudent.id);

        if (studentCourseData) {
            let final_rate = course.final / 100;
            let midterm_rate = course.midterm / 100;
            let grade = (studentCourseData.midterm * midterm_rate) + (studentCourseData.final * final_rate);
            weightedGradesSum += grade * course.credits;
        }
    }

    // Calculate GPA
    let gpa = totalCredits > 0 ? weightedGradesSum / totalCredits : 0;
    return gpa;

}

// Set event listener for Manage Student element
document.getElementById('search').addEventListener('click', loadSearch);

// Set event listener for Manage Courses element
document.getElementById('manage-courses').addEventListener('click', loadCourseManagement);



