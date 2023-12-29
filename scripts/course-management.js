// Sets the inner.HTML for Course Management
function loadCourseManagement(){
    mainContent.innerHTML = `
        <div class='card' id='view-courses'>
            <div class='dropdown-header'>
                <img id='dropdown-img' src='./img/right-arrow.png' alt=''><span>View Courses</span>
            </div>
            <div class='dropdown-content' id='course-list'></div>
        </div>
        <div class='card' id='add-course'>Add Course</div>
        <div class='card' id='delete-course'>Delete Course</div>
    `;

    // Set event listener for Add Course element
    document.getElementById('add-course').addEventListener('click', addCourse);

    // Check localstorage and fetch course data
    console.log(localStorage.getItem('lectures'));
    populateCourseList(JSON.parse(localStorage.getItem('lectures'))); // Parse the localStorage data as Array, by default it's string.
    
    // Set event listener for View Course element, change arrow icon 
    document.getElementById('view-courses').addEventListener('click', function() {
        if (this.classList.contains('dropdown-active')){
            this.classList.remove('dropdown-active');
            document.getElementById('dropdown-img').src = './img/right-arrow.png';
        } else{
            document.getElementById('dropdown-img').src = './img/down-arrow.png';
            this.classList.add('dropdown-active');
        }
    });
}

// Sets the inner.HTML for Add Course 
function addCourse(){
    console.log('Add Course');
    mainContent.innerHTML = `
    <h1>Add a New Course</h1>
        <form id='course-form'>
            <div class='form-group'>
                <label for='course-name'>Course Name:</label>
                <input type='text' id='course-name' name='courseName' required>
            </div>
            <div class='form-group'>
                <label for='final-rate'>Final Rate:</label>
                <input type='number' id='final-rate' name='finalRate' required>
            </div>
            <div class='form-group'>
                <label for='midterm-rate'>Midterm Rate:</label>
                <input type='number' id='midterm-rate' name='midtermRate' required>
            </div>
            <button type='submit' id='btn-green'>Add Course</button>
        </form>
        <div id='course-list'></div>
    `
    // Set an Event Listener for the Add Course form
    const courseForm = document.getElementById('course-form');

    // Load existing courses or initialize an empty list
    let courses = JSON.parse(localStorage.getItem('lectures')) || [];

    courseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Add new course to the JSON file
        const newCourse = {
            name: document.getElementById('course-name').value,
            midterm: document.getElementById('final-rate').value,
            final: document.getElementById('midterm-rate').value,
            students: []
        };

        courses.push(newCourse);
        localStorage.setItem('lectures', JSON.stringify(courses));
        displayCourses(courses); // Load the current courses from JSON file which loaded to localStorage
        courseForm.reset();
    });
}

// Displays the course list
function displayCourses(courses) {
    const courseListElement = document.getElementById('course-list');
    courseListElement.innerHTML = '<h2>Course List</h2>';

    courses.forEach(course => {
        courseListElement.innerHTML += `<div>${course.name} - Midterm Rate: ${course.midterm}%, Final Rate: ${course.final}%</div>`;
    });
}

// Displays the given course's students
function displayStudents(course){
    const studentListElement = document.getElementById('student-list');
    studentListElement.innerHTML = '<h2>Student List</h2>';

    console.log(course);
    //console.log(course.students);
    course.students.forEach(student => {
        studentListElement.innerHTML += `<div>${student.id} - Midterm Score: ${student.midterm}, Final Score: ${student.final}, Letter Grade: ${student.letter}</div>`;
    });
}

// Adds new student to the given course
function addStudentToCourse(course, div){
    console.log('called');
    div.innerHTML = `
    <h1>Add a New Student to ${course.name}</h1>
        <form id='add-student-to-course-form'>
            <div class='form-group'>
                <label for='student-name'>Student ID:</label>
                <input type='number' id='student-id' name='studentID' required>
            </div>
            <div class='form-group'>
                <label for='first-name'>First Name:</label>
                <input type='text' id='first-name' name='firstName' required>
            </div>
            <div class='form-group'>
                <label for='last-name'>Last Name:</label>
                <input type='text' id='last-name' name='lastName' required>
            </div>
            <div class='form-group'>
                <label for='midterm'>Midterm:</label>
                <input type='number' id='midterm' name='midterm' required>
            </div>
            <div class='form-group'>
                <label for='last-name'>Final:</label>
                <input type='number' id='final' name='final' required>
            </div>
            <button type='submit' id='btn-green'>Add Student</button>
        </form>
        <div id='student-list'></div>
    `
    div.style.display = 'block';
    // Set an Event Listener for the Add Student to Course form
    const studentToCourseForm = document.getElementById('add-student-to-course-form');

    // Load existing courses or initialize an empty list
    let courses = JSON.parse(localStorage.getItem('lectures')) || [];

    studentToCourseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let midterm_score = document.getElementById('midterm').value;
        let final_score = document.getElementById('final').value;
        let letter_grade =  calculateLetterGrade(course, midterm_score, final_score)

        // Add new student to the lecture
        const newStudent = {
            id: document.getElementById('student-id').value,
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            midterm: midterm_score,
            final: final_score,
            letter: letter_grade
        }

        // Add the student to course
        if (course) {
            course.students.push(newStudent);
        } else {
            console.log("Error: Course couldn't find!");
        }

        // Update the courses data
        courses.course = course;
        localStorage.setItem('lectures', JSON.stringify(courses));
        displayStudents(course); // Display the current courses from JSON file which loaded to localStorage
        studentToCourseForm.reset();
    });
}


// Show course details 
function showCourseDetails(course){
    // Refresh the content area
    mainContent.innerHTML = '';

    // Create table for course details
    const courseTable = document.createElement('table');
    courseTable.innerHTML = `<tr>
                                 <th>Course Name</th>
                                 <th>Midterm (%)</th>
                                 <th>Final (%)</th>
                             </tr>
                             <tr>
                                 <td>${course.name}</td>
                                 <td>${course.midterm}</td>
                                 <td>${course.final}</td>
                             </tr>`;
    mainContent.appendChild(courseTable);

    // Show Students button
    const showStudentsButton = document.createElement('button');
    showStudentsButton.textContent = 'Show Students';
    showStudentsButton.id = 'btn-green';
    mainContent.appendChild(showStudentsButton);

    // Add  Student button
    const addStudentButton = document.createElement('button');
    addStudentButton.textContent = 'Add Student';
    addStudentButton.id = 'btn-yellow';
    mainContent.appendChild(addStudentButton);

    // Create and prepare students list div
    const addStudentDiv = document.createElement('div');
    addStudentDiv.style.display = 'none';
    mainContent.appendChild(addStudentDiv);

    // Event listener for 'Add Student' button
    addStudentButton.addEventListener('click', function() {
        document.getElementById('btn-yellow').style.display = 'none'; // Hide upper button
        addStudentToCourse(course, addStudentDiv);
    })

    // Create and prepare students list div
    const studentsListDiv = document.createElement('div');
    studentsListDiv.style.display = 'none';
    mainContent.appendChild(studentsListDiv);

    // Event listener for 'Show Students' button
    showStudentsButton.addEventListener('click', function() {
        // Create table for students list
        let studentsHtml = '<h2>Students:</h2><table>';
        studentsHtml += '<tr><th>ID</th><th>Midterm</th><th>Final</th><th>Letter</th><th>Actions</th></tr>';
        course.students.forEach(student => {
            studentsHtml += `<tr>
                                <td>${student.id}</td>
                                <td>${student.midterm}</td>
                                <td>${student.final}</td>
                                <td>${student.letter}</td>
                                <td>
                                    <button class='edit-btn' data-id='${student.id}'>Edit</button>
                                    <button class='remove-btn' data-id='${student.id}'>Remove</button>
                                </td>
                             </tr>`;
        });
        studentsHtml += '</table>';
        studentsListDiv.innerHTML = studentsHtml;

        // Set event click listeners for edit/remove buttons
        studentsListDiv.addEventListener('click', function(event) {
            if (event.target.className === 'edit-btn') {
                const studentId = event.target.getAttribute('data-id');
                console.log('Edit student with ID:', studentId);
                editStudentModal(course, studentId);

            } else if (event.target.className === 'remove-btn') {
                const studentId = event.target.getAttribute('data-id');
                console.log('Remove student with ID:', studentId);
                // Add remove functionality here
            }
        });
        
        if(studentsListDiv.style.display === 'block') {
            studentsListDiv.style.display = 'none';
            showStudentsButton.textContent = 'Show Students';
        } else {
            studentsListDiv.style.display = 'block';
            showStudentsButton.textContent = 'Hide Students';
        }
        
    });

    
}

// Course-item click event listener
function onCourseItemClicked(course){
    // Show course details (name, final & midterm ratio)
    showCourseDetails(course);
}

// Populates the given course list with course-item divs
function populateCourseList(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; 
    console.log("in populate");
    //console.log(courses);
    courses.forEach(course => {
        console.log(course);
        const courseItem = document.createElement('div');

        // Add click eventlister for course-items
        courseItem.addEventListener('click', function() {
            onCourseItemClicked(course);
        });
        courseItem.classList.add('course-item');
        courseItem.textContent = course.name; 
        courseList.appendChild(courseItem);
    });
    localStorage.setItem('lectures', JSON.stringify(courses));
}