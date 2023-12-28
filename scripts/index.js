const mainContent = document.getElementById('main-content');
const courseList = document.getElementById('course-list');

// Sets the inner.HTML for Student Management and loads the json data to localStorage
function loadStudentManagement() {
    mainContent.innerHTML = `
        <div class="card" id="view-students" >View Students</div>
        <div class="card" id="add-student" >Add Student</div>
        <div class="card" id="delete-student" >Delete Student</div>
    `;
}

// Sets the inner.HTML for Course Management
function loadCourseManagement(){
    mainContent.innerHTML = `
        <div class="card" id="view-courses">
            <div class="dropdown-header">
                <img id="dropdown-img" src="./img/right-arrow.png" alt=""><span>View Courses</span>
            </div>
            <div class="dropdown-content" id="course-list"></div>
        </div>
        <div class="card" id="add-course">Add Course</div>
        <div class="card" id="delete-course">Delete Course</div>
    `;

    // Set event listener for Add Course element
    document.getElementById('add-course').addEventListener('click', addCourse);

    
    // Fetch course data
    fetch('./data/lectures.json')
    .then(response => response.json())
    .then(data => {
        populateCourseList(data);
    })
    .catch(error => console.error('Error fetching courses:', error));


    // Set event listener for View Course element, change arrow icon 
    document.getElementById('view-courses').addEventListener('click', function() {
        if (this.classList.contains("dropdown-active")){
            this.classList.remove("dropdown-active");
            document.getElementById("dropdown-img").src = "./img/right-arrow.png";
        } else{
            document.getElementById("dropdown-img").src = "./img/down-arrow.png";
            this.classList.add("dropdown-active");
        }

    });
}

// Sets the inner.HTML for Add Course 
function addCourse(){
    console.log("Add Course");
    mainContent.innerHTML = `
    <h1>Add a New Course</h1>
        <form id="course-form">
            <div class="form-group">
                <label for="course-name">Course Name:</label>
                <input type="text" id="course-name" name="courseName" required>
            </div>
            <div class="form-group">
                <label for="final-rate">Final Rate:</label>
                <input type="number" id="final-rate" name="finalRate" required>
            </div>
            <div class="form-group">
                <label for="midterm-rate">Midterm Rate:</label>
                <input type="number" id="midterm-rate" name="midtermRate" required>
            </div>
            <button type="submit" id="add-course-btn">Add Course</button>
        </form>
        <div id="course-list"></div>
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
            final: document.getElementById('midterm-rate').value
        };

        courses.push(newCourse);
        localStorage.setItem('lectures', JSON.stringify(courses));
        displayCourses(); // Load the current courses from JSON file which loaded to localStorage
        courseForm.reset();
    });

    function displayCourses() {
        const courseListElement = document.getElementById('course-list');
        courseListElement.innerHTML = '<h2>Course List</h2>';

        courses.forEach(course => {
            courseListElement.innerHTML += `<div>${course.name} - Midterm Rate: ${course.midterm}%, Final Rate: ${course.final}%</div>`;
        });
    }


}

function onCourseItemClicked(){
    console.log("course item clicked")
}

// Populates the given course list with course-item divs
function populateCourseList(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; 

    console.log(courses);
    courses.forEach(course => {
        const courseItem = document.createElement('div');

        // Add click eventlister for course-items
        courseItem.addEventListener("click",onCourseItemClicked)

        courseItem.classList.add('course-item');
        courseItem.textContent = course.name; 
        courseList.appendChild(courseItem);
    });
    localStorage.setItem('lectures', JSON.stringify(courses));
}



// Set event listener for Manage Student element
document.getElementById('manage-students').addEventListener('click', loadStudentManagement);

// Set event listener for Manage Courses element
document.getElementById('manage-courses').addEventListener('click', loadCourseManagement);



