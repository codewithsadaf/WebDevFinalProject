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
        <div class='card' id='delete-courses'>Delete Course</div>
    `;

    // Set event listener for Add Course element
    document.getElementById('add-course').addEventListener('click', addCourse);

    // Check localstorage and fetch course data
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

    // Set event listener for Delete Course element
    document.getElementById('delete-courses').addEventListener('click',function (){
        // Display all of the courses 
        let courses = JSON.parse(localStorage.getItem('lectures'));

        const courseListDiv = document.createElement('div');
        courseListDiv.id = 'course-list';
        mainContent.innerHTML = '';
        mainContent.appendChild(courseListDiv);

        displayCoursesTable(courses, courseListDiv);
        courseListDiv.style.display = 'block';
    });
}

// Sets the inner.HTML for Add Course 
function addCourse(){
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
            <button type='submit' class='btn-green'>Add Course</button>
        </form>
        <div id='course-list'></div>
    `
    // Set an Event Listener for the Add Course form
    const courseForm = document.getElementById('course-form');

    

    courseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Add new course to the JSON file
        const newCourse = {
            id: getNextCourseId(),
            name: document.getElementById('course-name').value,
            midterm: document.getElementById('final-rate').value,
            final: document.getElementById('midterm-rate').value,
            students: []
        };
        // Load existing courses or initialize an empty list
        let courses = JSON.parse(localStorage.getItem('lectures')) || [];
        courses.push(newCourse);

        localStorage.setItem('lectures', JSON.stringify(courses));
        let courseListDiv = document.getElementById('course-list');
        courseListDiv.style.display = 'none';
        displayCoursesTable(courses, courseListDiv); // Load the current courses from JSON file which loaded to localStorage
        courseForm.reset();
    });
}

// Returns the next ID value for a new course item
function getNextCourseId(){
    let courses = JSON.parse(localStorage.getItem('lectures'))
    console.log(courses);
    let lastIndex = courses.length - 1

    return lastIndex + 2;
}

// Displays the course list
function displayCoursesTable(courses, courseListDiv) {
    courseListDiv.innerHTML = '';
    let coursesHtml = '<h2>Courses:</h2><table>';
    coursesHtml += '<tr><th>Name</th><th>Midterm Rate (%)</th><th>Final Rate (%)</th><th>Actions</th></tr>';
    courses.forEach(course => {
        coursesHtml += `<tr>
                            <td>${course.name}</td>
                            <td>${course.midterm}</td>
                            <td>${course.final}</td>
                            <td>
                                <button class='edit-btn' data-id='${course.id}'>Edit</button>
                                <button class='remove-btn' data-id='${course.id}'>Remove</button>
                            </td>
                         </tr>`;
    });
    coursesHtml += '</table>';
    courseListDiv.innerHTML = coursesHtml;

    if (courseListDiv.style.display === 'none'){
        courseListDiv.style.display = 'block';
    } else {
        courseListDiv.style.display = 'none';
    }

    // Create modal div for edit/remove buttons
    if (!document.getElementsByClassName('modal')[0]){
        modal = document.createElement('div');
        modal.className = 'modal';
        mainContent.appendChild(modal);
    } else {
        modal = document.getElementsByClassName('modal')[0];
    }

    // Set event click listeners for edit/remove buttons
    courseListDiv.addEventListener('click', function(event) {
        var courseId = event.target.getAttribute('data-id');
        var course = getCourseById(courses, courseId);
        if (event.target.className === 'edit-btn') {
            console.log('Edit course with ID:', courseId);
            showCourseModal(course, modal);
            

        } else if (event.target.className === 'remove-btn') {
            console.log('Remove course with ID:', courseId);
            showRemoveCourseModal(course, modal);
        }
    });
}

// Displays the modal for remove course operation
function showRemoveCourseModal(course, modal){
    modal.innerHTML = '';
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <h4>Are you sure you want to remove  the course?</h4>
        <div class="input-field">
            <label for="removeCoursename">Course Name:</label>
            <input type="text" id="removeCourseName">
        </div>
        <button id="removeCourse" class="btn">Remove</button>
    </div>
    `
    // Capture modal elements
    const courseNameInput = document.getElementById('removeCourseName');
    const removeButton = document.getElementById('removeCourse');

    // Populate modal fields with student data
    courseNameInput.value = course.name;

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to remove button
    removeButton.addEventListener('click', function (){
        console.log('Removing the course from the system. Course ID:', course.id);
        removeCourse(course.id);
        
        // Update the course list table
        let updatedCourses = JSON.parse(localStorage.getItem('lectures'));
        let courseListDiv = document.getElementById('course-list');
        courseListDiv.style.display = 'none';
        displayCoursesTable(updatedCourses, courseListDiv);

        // Hide the modal after saving
        modal.style.display = 'none';
    });

    // Added another event listener for close button
    const closeButton = document.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
}

// Removes the course for the given id from localstorage
function removeCourse(id){
    let oldCourses = JSON.parse(localStorage.getItem('lectures'));
    for (let index = 0; index < oldCourses.length; index++) {
        const course = oldCourses[index];
        if (Number(course.id) == Number(id)){
            oldCourses.splice(index, 1); // Remove the element 

            // Update localStorage
            localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses
        }
    }
}

// Displays the edit course modal view
function showCourseModal(course, modal){
    modal.innerHTML = '';
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <h4>Edit Course</h4>
        <div class="input-field">
            <label for="editName">Course Name:</label>
            <input type="text" id="editCourseName">
        </div>
        <div class="input-field">
            <label for="editMidterm">Midterm Rate:</label>
            <input type="number" id="editMidterm">
        </div>
        <div class="input-field">
            <label for="editFinal">Final Rate:</label>
            <input type="number" id="editFinal">
        </div>
        <button id="saveCourseChanges" class="btn">Save</button>
    </div>
    ` 
    // Capture modal elements
    const courseNameInput = document.getElementById('editCourseName');
    const midtermInput = document.getElementById('editMidterm');
    const finalInput = document.getElementById('editFinal');
    const saveButton = document.getElementById('saveCourseChanges');

    // Populate values
    courseNameInput.value = course.name;
    midtermInput.value = course.midterm;
    finalInput.value = course.final;

    // Show the modal
    modal.style.display = 'block';

   

    // Add event listener to save button
    saveButton.onclick = function() {
         // Load existing courses
        let courses = JSON.parse(localStorage.getItem('lectures'));

        // Implement save functionality
        console.log('Save changes for course :', course.name);
         
        // Hide the modal after saving
        modal.style.display = 'none';
         
        // Update Course data or refresh list here
        const updatedCourse = {
            id: Number(course.id),
            name: document.getElementById('editCourseName').value,
            midterm: Number(document.getElementById('editMidterm').value),
            final: Number(document.getElementById('editFinal').value),
            students: course.students
        };
        updateCourse(courses, updatedCourse);
        let updatedCourses = JSON.parse(localStorage.getItem('lectures'));
        let courseListDiv = document.getElementById('course-list');
        courseListDiv.style.display = 'none';
        displayCoursesTable(updatedCourses, courseListDiv);
    };
 
    // Added another event listener for close button
    const closeButton = document.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
}

// Updates the given course and saves localStorage
function updateCourse(courses, updatedCourse){
    for (let i = 0; i < courses.length; i++) {
        if (Number(courses[i].id) === Number(updatedCourse.id)){
            courses[i] = updatedCourse;
            console.log("Update course operation finished");
            console.log(courses);
            break;
        } 
    }
    // Update localStorage
    localStorage.setItem('lectures', JSON.stringify(courses));
}


// Adds new student to the given course
function addStudentToCourse(course, div){
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
            <button type='submit' class='btn-green'>Add Student</button>
        </form>
    `
    div.style.display = 'block';
    // Set an Event Listener for the Add Student to Course form
    const studentToCourseForm = document.getElementById('add-student-to-course-form');

    studentToCourseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let midterm_score = document.getElementById('midterm').value;
        let final_score = document.getElementById('final').value;
        let letter_grade =  calculateLetterGrade(course, midterm_score, final_score)

        // Add new student to the lecture
        const newStudent = {
            id: document.getElementById('student-id').value,
            name: document.getElementById('first-name').value,
            surname: document.getElementById('last-name').value,
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
        // Update localStorage
        let oldCourses = JSON.parse(localStorage.getItem('lectures'));
        for (let k = 0; k < oldCourses.length; k++) {
            if (Number(oldCourses[k].id) === Number(course.id)){
                oldCourses[k] = course; 
                localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses
                break;
            }
        }

        let studentListDiv = document.getElementById('student-list')
        if (!studentListDiv){
            // Create and prepare students list div
            studentListDiv = document.createElement('div');
            studentListDiv.id = 'student-list';
            studentListDiv.style.display = 'none';
            mainContent.appendChild(studentListDiv);
        }
        studentListDiv.style.display = 'none';
        displayStudentsTable(course); // Display the current courses from JSON file which loaded to localStorage
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
    showStudentsButton.className = 'btn-green';
    showStudentsButton.id = 'show-students';
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
    });
    

    if (!document.getElementById('student-list')){
        // Create and prepare students list div
        var studentsListDiv = document.createElement('div');
        studentsListDiv.id = 'student-list';
        studentsListDiv.style.display = 'none';
        mainContent.appendChild(studentsListDiv);
    }

    // Event listener for 'Show Students' button
    showStudentsButton.addEventListener('click', function() {
        var studentsListDiv = document.getElementById('student-list');
        studentsListDiv.innerHTML = '';
        displayStudentsTable(course);
    });

    
}

// Displays the students table in the given div
function displayStudentsTable(course){
    var showStudentsButton = document.getElementById('show-students');
    var studentsListDiv = document.getElementById('student-list');

    if(showStudentsButton.textContent === 'Show Students') {
        showStudentsButton.textContent = 'Hide Students';
    } else {
        showStudentsButton.textContent = 'Show Students';
    }
    studentsListDiv.innerHTML = '';

    // Create table for students list
    let studentsHtml = '<h2>Students:</h2><table>';
    studentsHtml += '<tr><th>ID</th><th>Name</th><th>Surname</th><th>Midterm</th><th>Final</th><th>Letter</th><th>Actions</th></tr>';
    course.students.forEach(student => {
        studentsHtml += `<tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>${student.surname}</td>
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

    if (studentsListDiv.style.display === 'none'){
        studentsListDiv.style.display = 'block';
    } else {
        studentsListDiv.style.display = 'none';
    }

    // Create modal div for edit/remove buttons
    if (!document.getElementsByClassName('modal')[0]){
        modal = document.createElement('div');
        modal.className = 'modal';
        mainContent.appendChild(modal);
    } else {
        modal = document.getElementsByClassName('modal')[0];
    }
    

    // Set event click listeners for edit/remove buttons
    studentsListDiv.addEventListener('click', function(event) {
        var studentId = event.target.getAttribute('data-id');
        var student = getStudentByID(course, studentId);
        if (event.target.className === 'edit-btn') {
            console.log('Edit student with ID:', studentId);
            showStudentModal(student, modal);

        } else if (event.target.className === 'remove-btn') {
            console.log('Remove student with ID:', studentId);
            showRemoveStudentModal(student, modal, course);
        }
    });
}

// Shows a pop-up for remove student from a course modal view
function showRemoveStudentModal(student, modal, course) {
    modal.innerHTML = '';
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <h4>Are you sure you want to remove  the student?</h4>
        <div class="input-field">
            <label for="removeStudentId">Student ID:</label>
            <input type="number" id="removeStudentId" disabled>
        </div>
        <div class="input-field">
            <label for="removeStudentName">Student Name:</label>
            <input type="text" id="removeStudentName">
        </div>
        <div class="input-field">
            <label for="removeStudentSurname">Student Surname:</label>
            <input type="text" id="removeStudentSurname">
        </div>
        <button id="removeStudent" class="btn">Remove</button>
    </div>
    `
    // Capture modal elements
    const studentIdInput = document.getElementById('removeStudentId');
    const studentNameInput = document.getElementById('removeStudentName');
    const studentSurnameInput = document.getElementById('removeStudentSurname');
    const removeButton = document.getElementById('removeStudent');

    // Populate modal fields with student data
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentSurnameInput.value = student.surname;

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to remove button
    removeButton.addEventListener('click', function (){
        console.log('Removing the student from the selected course. Student ID:', student.id);
        updatedCourse = removeStudentFromCourse(student, course);

        // Get the updated data from localStorage 
        upatedCourses = JSON.parse(localStorage.getItem('lectures'));
        
        // Clear table
        studentListTable = document.getElementById('student-list');
        studentListTable.innerHTML = '';

        // Show updated table
        displayStudentsTable(course);

        // Hide the modal after saving
        modal.style.display = 'none';
    });

    // Added another event listener for close button
    const closeButton = document.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
   
}

function getCourseById(courses, courseId){
    for (let i = 0; i < courses.length; i++) {
        if(Number(courses[i].id) === Number(courseId)){
            return courses[i];
        }
    }
}

// Removes the given student from the given course
function removeStudentFromCourse(student, course){
    for (let i = 0; i < course.students.length; i++) {
        if (Number(course.students[i].id) == Number(student.id)){
            course.students.splice(i,1); //Remove the target student from array
            console.log("Remove operation finished");

            // Update localStorage
            let oldCourses = JSON.parse(localStorage.getItem('lectures'));
            for (let k = 0; k < oldCourses.length; k++) {
                if (Number(oldCourses[k].id) === Number(course.id)){
                    oldCourses[k] = course; 
                    localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses
                    break;
                }
            }
            return course;
        }
    } 
}

// Shows a pop-up for edit student modal view
function showStudentModal(student, modal){
    modal.innerHTML = '';
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <h4>Edit Student</h4>
        <div class="input-field">
            <label for="editStudentId">Student ID:</label>
            <input type="number" id="editStudentId">
        </div>
        <div class="input-field">
            <label for="editName">Student Name:</label>
            <input type="text" id="editStudentName">
        </div>
        <div class="input-field">
            <label for="editSurname">Student Surname:</label>
            <input type="text" id="editStudentSurname">
        </div>
        <div class="input-field">
            <label for="editMidterm">Midterm Score:</label>
            <input type="number" id="editMidterm">
        </div>
        <div class="input-field">
            <label for="editFinal">Final Score:</label>
            <input type="number" id="editFinal">
        </div>
        <div class="input-field">
            <label for="editLetter">Letter Grade:</label>
            <input type="text" id="editLetter">
        </div>
        <button id="saveStudentChanges" class="btn">Save</button>
    </div>
    `
   
    // Capture modal elements
    const studentIdInput = document.getElementById('editStudentId');
    const studentNameInput = document.getElementById('editStudentName');
    const studentSurnameInput = document.getElementById('editStudentSurname');
    const midtermInput = document.getElementById('editMidterm');
    const finalInput = document.getElementById('editFinal');
    const letterInput = document.getElementById('editLetter');
    const saveButton = document.getElementById('saveStudentChanges');

    // Populate modal fields with student data
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentSurnameInput.value = student.surname;
    midtermInput.value = student.midterm;
    finalInput.value = student.final;
    letterInput.value = student.letter;

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to save button
    saveButton.onclick = function() {
        // Implement save functionality
        console.log('Save changes for student ID:', student.id);
        
        // Hide the modal after saving
        modal.style.display = 'none';
        
        // Update student data or refresh list here
        // ...
    };

    // Added another event listener for close button
    const closeButton = document.querySelector('.close');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
}

// Returns the student object of course item for the given student ID
function getStudentByID(course, id){
    for(let student of course.students){
        if (Number(student.id) === Number(id)) {
            return student;
        }
    }
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
    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.classList.add('course-item');
        courseItem.textContent = course.name; 
        // Add click eventlister for course-items
        courseItem.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent bubbling
            onCourseItemClicked(course);
        });
        courseList.appendChild(courseItem);
    });
    localStorage.setItem('lectures', JSON.stringify(courses));
}