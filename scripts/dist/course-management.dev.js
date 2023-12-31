"use strict";

// Sets the inner.HTML for Course Management
function loadCourseManagement() {
  mainContent.innerHTML = "\n        <div class='card' id='view-courses'>\n            <div class='dropdown-header'>\n                <img id='dropdown-img' src='./img/right-arrow.png' alt=''><span>View Courses</span>\n            </div>\n            <div class='dropdown-content' id='course-list'></div>\n        </div>\n        <div class='card' id='add-course'>Add Course</div>\n        <div class='card' id='delete-courses'>Delete Course</div>\n    "; // Set event listener for Add Course element

  document.getElementById('add-course').addEventListener('click', addCourse); // Check localstorage and fetch course data

  populateCourseList(JSON.parse(localStorage.getItem('lectures'))); // Parse the localStorage data as Array, by default it's string.
  // Set event listener for View Course element, change arrow icon 

  document.getElementById('view-courses').addEventListener('click', function () {
    if (this.classList.contains('dropdown-active')) {
      this.classList.remove('dropdown-active');
      document.getElementById('dropdown-img').src = './img/right-arrow.png';
    } else {
      document.getElementById('dropdown-img').src = './img/down-arrow.png';
      this.classList.add('dropdown-active');
    }
  }); // Set event listener for Delete Course element

  document.getElementById('delete-courses').addEventListener('click', function () {
    // Display all of the courses 
    var courses = JSON.parse(localStorage.getItem('lectures'));
    var courseListDiv = document.createElement('div');
    courseListDiv.id = 'course-list';
    mainContent.innerHTML = '';
    mainContent.appendChild(courseListDiv);
    displayCoursesTable(courses, courseListDiv);
    courseListDiv.style.display = 'block';
  });
} // Sets the inner.HTML for Add Course 


function addCourse() {
  mainContent.innerHTML = "\n    <h1>Add a New Course</h1>\n        <form id='course-form'>\n            <div class='form-group'>\n                <label for='course-name'>Course Name:</label>\n                <input type='text' id='course-name' name='courseName' required>\n            </div>\n            <div class='form-group'>\n                <label for='final-rate'>Final Rate:</label>\n                <input type='number' id='final-rate' name='finalRate' required>\n            </div>\n            <div class='form-group'>\n                <label for='midterm-rate'>Midterm Rate:</label>\n                <input type='number' id='midterm-rate' name='midtermRate' required>\n            </div>\n            <button type='submit' class='btn-green'>Add Course</button>\n        </form>\n        <div id='course-list'></div>\n    "; // Set an Event Listener for the Add Course form

  var courseForm = document.getElementById('course-form');
  courseForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Add new course to the JSON file

    var newCourse = {
      id: getNextCourseId(),
      name: document.getElementById('course-name').value,
      midterm: document.getElementById('final-rate').value,
      "final": document.getElementById('midterm-rate').value,
      students: []
    }; // Load existing courses or initialize an empty list

    var courses = JSON.parse(localStorage.getItem('lectures')) || [];
    courses.push(newCourse);
    localStorage.setItem('lectures', JSON.stringify(courses));
    var courseListDiv = document.getElementById('course-list');
    courseListDiv.style.display = 'none';
    displayCoursesTable(courses, courseListDiv); // Load the current courses from JSON file which loaded to localStorage

    courseForm.reset();
  });
} // Returns the next ID value for a new course item


function getNextCourseId() {
  var courses = JSON.parse(localStorage.getItem('lectures'));
  console.log(courses);
  var lastIndex = courses.length - 1;
  return lastIndex + 2;
} // Displays the course list


function displayCoursesTable(courses, courseListDiv) {
  courseListDiv.innerHTML = '';
  var coursesHtml = '<h2>Courses:</h2><table>';
  coursesHtml += '<tr><th>Name</th><th>Midterm Rate (%)</th><th>Final Rate (%)</th><th>Actions</th></tr>';
  courses.forEach(function (course) {
    coursesHtml += "<tr>\n                            <td>".concat(course.name, "</td>\n                            <td>").concat(course.midterm, "</td>\n                            <td>").concat(course["final"], "</td>\n                            <td>\n                                <button class='edit-btn' data-id='").concat(course.id, "'>Edit</button>\n                                <button class='remove-btn' data-id='").concat(course.id, "'>Remove</button>\n                            </td>\n                         </tr>");
  });
  coursesHtml += '</table>';
  courseListDiv.innerHTML = coursesHtml;

  if (courseListDiv.style.display === 'none') {
    courseListDiv.style.display = 'block';
  } else {
    courseListDiv.style.display = 'none';
  } // Create modal div for edit/remove buttons


  if (!document.getElementsByClassName('modal')[0]) {
    modal = document.createElement('div');
    modal.className = 'modal';
    mainContent.appendChild(modal);
  } else {
    modal = document.getElementsByClassName('modal')[0];
  } // Set event click listeners for edit/remove buttons


  courseListDiv.addEventListener('click', function (event) {
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
} // Displays the modal for remove course operation


function showRemoveCourseModal(course, modal) {
  modal.innerHTML = '';
  modal.innerHTML = "\n    <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <h4>Are you sure you want to remove  the course?</h4>\n        <div class=\"input-field\">\n            <label for=\"removeCoursename\">Course Name:</label>\n            <input type=\"text\" id=\"removeCourseName\">\n        </div>\n        <button id=\"removeCourse\" class=\"btn\">Remove</button>\n    </div>\n    "; // Capture modal elements

  var courseNameInput = document.getElementById('removeCourseName');
  var removeButton = document.getElementById('removeCourse'); // Populate modal fields with student data

  courseNameInput.value = course.name; // Show the modal

  modal.style.display = 'block'; // Add event listener to remove button

  removeButton.addEventListener('click', function () {
    console.log('Removing the course from the system. Course ID:', course.id);
    removeCourse(course.id); // Update the course list table

    var updatedCourses = JSON.parse(localStorage.getItem('lectures'));
    var courseListDiv = document.getElementById('course-list');
    courseListDiv.style.display = 'none';
    displayCoursesTable(updatedCourses, courseListDiv); // Hide the modal after saving

    modal.style.display = 'none';
  }); // Added another event listener for close button

  var closeButton = document.querySelector('.close');

  closeButton.onclick = function () {
    modal.style.display = 'none';
  };
} // Removes the course for the given id from localstorage


function removeCourse(id) {
  var oldCourses = JSON.parse(localStorage.getItem('lectures'));

  for (var index = 0; index < oldCourses.length; index++) {
    var course = oldCourses[index];

    if (Number(course.id) == Number(id)) {
      oldCourses.splice(index, 1); // Remove the element 
      // Update localStorage

      localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses
    }
  }
} // Displays the edit course modal view


function showCourseModal(course, modal) {
  modal.innerHTML = '';
  modal.innerHTML = "\n    <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <h4>Edit Course</h4>\n        <div class=\"input-field\">\n            <label for=\"editName\">Course Name:</label>\n            <input type=\"text\" id=\"editCourseName\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editMidterm\">Midterm Rate:</label>\n            <input type=\"number\" id=\"editMidterm\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editFinal\">Final Rate:</label>\n            <input type=\"number\" id=\"editFinal\">\n        </div>\n        <button id=\"saveCourseChanges\" class=\"btn\">Save</button>\n    </div>\n    "; // Capture modal elements

  var courseNameInput = document.getElementById('editCourseName');
  var midtermInput = document.getElementById('editMidterm');
  var finalInput = document.getElementById('editFinal');
  var saveButton = document.getElementById('saveCourseChanges'); // Populate values

  courseNameInput.value = course.name;
  midtermInput.value = course.midterm;
  finalInput.value = course["final"]; // Show the modal

  modal.style.display = 'block'; // Add event listener to save button

  saveButton.onclick = function () {
    // Load existing courses
    var courses = JSON.parse(localStorage.getItem('lectures')); // Implement save functionality

    console.log('Save changes for course :', course.name); // Hide the modal after saving

    modal.style.display = 'none'; // Update Course data or refresh list here

    var updatedCourse = {
      id: Number(course.id),
      name: document.getElementById('editCourseName').value,
      midterm: Number(document.getElementById('editMidterm').value),
      "final": Number(document.getElementById('editFinal').value),
      students: course.students
    };
    updateCourse(courses, updatedCourse);
    var updatedCourses = JSON.parse(localStorage.getItem('lectures'));
    var courseListDiv = document.getElementById('course-list');
    courseListDiv.style.display = 'none';
    displayCoursesTable(updatedCourses, courseListDiv);
  }; // Added another event listener for close button


  var closeButton = document.querySelector('.close');

  closeButton.onclick = function () {
    modal.style.display = 'none';
  };
} // Updates the given course and saves localStorage


function updateCourse(courses, updatedCourse) {
  for (var i = 0; i < courses.length; i++) {
    if (Number(courses[i].id) === Number(updatedCourse.id)) {
      courses[i] = updatedCourse;
      console.log("Update course operation finished");
      console.log(courses);
      break;
    }
  } // Update localStorage


  localStorage.setItem('lectures', JSON.stringify(courses));
} // Adds new student to the given course


function addStudentToCourse(course, div) {
  div.innerHTML = "\n    <h1>Add a New Student to ".concat(course.name, "</h1>\n        <form id='add-student-to-course-form'>\n            <div class='form-group'>\n                <label for='student-name'>Student ID:</label>\n                <input type='number' id='student-id' name='studentID' required>\n            </div>\n            <div class='form-group'>\n                <label for='first-name'>First Name:</label>\n                <input type='text' id='first-name' name='firstName' required>\n            </div>\n            <div class='form-group'>\n                <label for='last-name'>Last Name:</label>\n                <input type='text' id='last-name' name='lastName' required>\n            </div>\n            <div class='form-group'>\n                <label for='midterm'>Midterm:</label>\n                <input type='number' id='midterm' name='midterm' required>\n            </div>\n            <div class='form-group'>\n                <label for='last-name'>Final:</label>\n                <input type='number' id='final' name='final' required>\n            </div>\n            <button type='submit' class='btn-green'>Add Student</button>\n        </form>\n    ");
  div.style.display = 'block'; // Set an Event Listener for the Add Student to Course form

  var studentToCourseForm = document.getElementById('add-student-to-course-form');
  studentToCourseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var midterm_score = document.getElementById('midterm').value;
    var final_score = document.getElementById('final').value;
    var letter_grade = calculateLetterGrade(course, midterm_score, final_score); // Add new student to the lecture

    var newStudent = {
      id: document.getElementById('student-id').value,
      name: document.getElementById('first-name').value,
      surname: document.getElementById('last-name').value,
      midterm: midterm_score,
      "final": final_score,
      letter: letter_grade
    }; // Add the student to course

    if (course) {
      course.students.push(newStudent);
    } else {
      console.log("Error: Course couldn't find!");
    } // Update the courses data
    // Update localStorage


    var oldCourses = JSON.parse(localStorage.getItem('lectures'));

    for (var k = 0; k < oldCourses.length; k++) {
      if (Number(oldCourses[k].id) === Number(course.id)) {
        oldCourses[k] = course;
        localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses

        break;
      }
    }

    var studentListDiv = document.getElementById('student-list');

    if (!studentListDiv) {
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
} // Show course details 


function showCourseDetails(course) {
  // Refresh the content area
  mainContent.innerHTML = ''; // Create table for course details

  var courseTable = document.createElement('table');
  courseTable.innerHTML = "<tr>\n                                 <th>Course Name</th>\n                                 <th>Midterm (%)</th>\n                                 <th>Final (%)</th>\n                             </tr>\n                             <tr>\n                                 <td>".concat(course.name, "</td>\n                                 <td>").concat(course.midterm, "</td>\n                                 <td>").concat(course["final"], "</td>\n                             </tr>");
  mainContent.appendChild(courseTable); // Show Students button

  var showStudentsButton = document.createElement('button');
  showStudentsButton.textContent = 'Show Students';
  showStudentsButton.className = 'btn-green';
  showStudentsButton.id = 'show-students';
  mainContent.appendChild(showStudentsButton); // Add  Student button

  var addStudentButton = document.createElement('button');
  addStudentButton.textContent = 'Add Student';
  addStudentButton.id = 'btn-yellow';
  mainContent.appendChild(addStudentButton); // Create and prepare students list div

  var addStudentDiv = document.createElement('div');
  addStudentDiv.style.display = 'none';
  mainContent.appendChild(addStudentDiv); // Event listener for 'Add Student' button

  addStudentButton.addEventListener('click', function () {
    document.getElementById('btn-yellow').style.display = 'none'; // Hide upper button

    addStudentToCourse(course, addStudentDiv);
  });

  if (!document.getElementById('student-list')) {
    // Create and prepare students list div
    var studentsListDiv = document.createElement('div');
    studentsListDiv.id = 'student-list';
    studentsListDiv.style.display = 'none';
    mainContent.appendChild(studentsListDiv);
  } // Event listener for 'Show Students' button


  showStudentsButton.addEventListener('click', function () {
    var studentsListDiv = document.getElementById('student-list');
    studentsListDiv.innerHTML = '';
    displayStudentsTable(course);
  });
} // Displays the students table in the given div


function displayStudentsTable(course) {
  var showStudentsButton = document.getElementById('show-students');
  var studentsListDiv = document.getElementById('student-list');

  if (showStudentsButton.textContent === 'Show Students') {
    showStudentsButton.textContent = 'Hide Students';
  } else {
    showStudentsButton.textContent = 'Show Students';
  }

  studentsListDiv.innerHTML = ''; // Create table for students list

  var studentsHtml = '<h2>Students:</h2><table>';
  studentsHtml += '<tr><th>ID</th><th>Name</th><th>Surname</th><th>Midterm</th><th>Final</th><th>Letter</th><th>Actions</th></tr>';
  course.students.forEach(function (student) {
    studentsHtml += "<tr>\n                            <td>".concat(student.id, "</td>\n                            <td>").concat(student.name, "</td>\n                            <td>").concat(student.surname, "</td>\n                            <td>").concat(student.midterm, "</td>\n                            <td>").concat(student["final"], "</td>\n                            <td>").concat(student.letter, "</td>\n                            <td>\n                                <button class='edit-btn' data-id='").concat(student.id, "'>Edit</button>\n                                <button class='remove-btn' data-id='").concat(student.id, "'>Remove</button>\n                            </td>\n                         </tr>");
  });
  studentsHtml += '</table>';
  studentsListDiv.innerHTML = studentsHtml;

  if (studentsListDiv.style.display === 'none') {
    studentsListDiv.style.display = 'block';
  } else {
    studentsListDiv.style.display = 'none';
  } // Create modal div for edit/remove buttons


  if (!document.getElementsByClassName('modal')[0]) {
    modal = document.createElement('div');
    modal.className = 'modal';
    mainContent.appendChild(modal);
  } else {
    modal = document.getElementsByClassName('modal')[0];
  } // Set event click listeners for edit/remove buttons


  studentsListDiv.addEventListener('click', function (event) {
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
} // Shows a pop-up for remove student from a course modal view


function showRemoveStudentModal(student, modal, course) {
  modal.innerHTML = '';
  modal.innerHTML = "\n    <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <h4>Are you sure you want to remove  the student?</h4>\n        <div class=\"input-field\">\n            <label for=\"removeStudentId\">Student ID:</label>\n            <input type=\"number\" id=\"removeStudentId\" disabled>\n        </div>\n        <div class=\"input-field\">\n            <label for=\"removeStudentName\">Student Name:</label>\n            <input type=\"text\" id=\"removeStudentName\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"removeStudentSurname\">Student Surname:</label>\n            <input type=\"text\" id=\"removeStudentSurname\">\n        </div>\n        <button id=\"removeStudent\" class=\"btn\">Remove</button>\n    </div>\n    "; // Capture modal elements

  var studentIdInput = document.getElementById('removeStudentId');
  var studentNameInput = document.getElementById('removeStudentName');
  var studentSurnameInput = document.getElementById('removeStudentSurname');
  var removeButton = document.getElementById('removeStudent'); // Populate modal fields with student data

  studentIdInput.value = student.id;
  studentNameInput.value = student.name;
  studentSurnameInput.value = student.surname; // Show the modal

  modal.style.display = 'block'; // Add event listener to remove button

  removeButton.addEventListener('click', function () {
    console.log('Removing the student from the selected course. Student ID:', student.id);
    updatedCourse = removeStudentFromCourse(student, course); // Get the updated data from localStorage 

    upatedCourses = JSON.parse(localStorage.getItem('lectures')); // Clear table

    studentListTable = document.getElementById('student-list');
    studentListTable.innerHTML = ''; // Show updated table

    displayStudentsTable(course); // Hide the modal after saving

    modal.style.display = 'none';
  }); // Added another event listener for close button

  var closeButton = document.querySelector('.close');

  closeButton.onclick = function () {
    modal.style.display = 'none';
  };
}

function getCourseById(courses, courseId) {
  for (var i = 0; i < courses.length; i++) {
    if (Number(courses[i].id) === Number(courseId)) {
      return courses[i];
    }
  }
} // Removes the given student from the given course


function removeStudentFromCourse(student, course) {
  for (var i = 0; i < course.students.length; i++) {
    if (Number(course.students[i].id) == Number(student.id)) {
      course.students.splice(i, 1); //Remove the target student from array

      console.log("Remove operation finished");
      console.log(course.students); // Update localStorage

      var oldCourses = JSON.parse(localStorage.getItem('lectures'));

      for (var k = 0; k < oldCourses.length; k++) {
        if (Number(oldCourses[k].id) === Number(course.id)) {
          oldCourses[k] = course;
          localStorage.setItem('lectures', JSON.stringify(oldCourses)); // Update the oldCourses

          break;
        }
      }

      return course;
    }
  }
} // Shows a pop-up for edit student modal view


function showStudentModal(student, modal) {
  modal.innerHTML = '';
  modal.innerHTML = "\n    <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <h4>Edit Student</h4>\n        <div class=\"input-field\">\n            <label for=\"editStudentId\">Student ID:</label>\n            <input type=\"number\" id=\"editStudentId\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editName\">Student Name:</label>\n            <input type=\"text\" id=\"editStudentName\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editSurname\">Student Surname:</label>\n            <input type=\"text\" id=\"editStudentSurname\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editMidterm\">Midterm Score:</label>\n            <input type=\"number\" id=\"editMidterm\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editFinal\">Final Score:</label>\n            <input type=\"number\" id=\"editFinal\">\n        </div>\n        <div class=\"input-field\">\n            <label for=\"editLetter\">Letter Grade:</label>\n            <input type=\"text\" id=\"editLetter\">\n        </div>\n        <button id=\"saveStudentChanges\" class=\"btn\">Save</button>\n    </div>\n    "; // Capture modal elements

  var studentIdInput = document.getElementById('editStudentId');
  var studentNameInput = document.getElementById('editStudentName');
  var studentSurnameInput = document.getElementById('editStudentSurname');
  var midtermInput = document.getElementById('editMidterm');
  var finalInput = document.getElementById('editFinal');
  var letterInput = document.getElementById('editLetter');
  var saveButton = document.getElementById('saveStudentChanges'); // Populate modal fields with student data

  studentIdInput.value = student.id;
  studentNameInput.value = student.name;
  studentSurnameInput.value = student.surname;
  midtermInput.value = student.midterm;
  finalInput.value = student["final"];
  letterInput.value = student.letter; // Show the modal

  modal.style.display = 'block'; // Add event listener to save button

  saveButton.onclick = function () {
    // Implement save functionality
    console.log('Save changes for student ID:', student.id); // Hide the modal after saving

    modal.style.display = 'none'; // Update student data or refresh list here
    // ...
  }; // Added another event listener for close button


  var closeButton = document.querySelector('.close');

  closeButton.onclick = function () {
    modal.style.display = 'none';
  };
} // Returns the student object of course item for the given student ID


function getStudentByID(course, id) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = course.students[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var student = _step.value;

      if (Number(student.id) === Number(id)) {
        return student;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
} // Course-item click event listener


function onCourseItemClicked(course) {
  // Show course details (name, final & midterm ratio)
  showCourseDetails(course);
} // Populates the given course list with course-item divs


function populateCourseList(courses) {
  var courseList = document.getElementById('course-list');
  courseList.innerHTML = ''; //console.log(courses);

  courses.forEach(function (course) {
    var courseItem = document.createElement('div');
    courseItem.classList.add('course-item');
    courseItem.textContent = course.name; // Add click eventlister for course-items

    courseItem.addEventListener('click', function (event) {
      event.stopPropagation(); // Prevent bubbling

      onCourseItemClicked(course);
    });
    courseList.appendChild(courseItem);
  });
  localStorage.setItem('lectures', JSON.stringify(courses));
}