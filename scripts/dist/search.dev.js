"use strict";

// Sets the inner.HTML for Advanced Search option
function loadSearch() {
  mainContent.innerHTML = '';
  searchDiv = document.createElement('div');
  courses = JSON.parse(localStorage.getItem('lectures'));
  searchForm = "\n    <form id=\"searchForm\">\n            <input type=\"text\" id=\"searchInput\" placeholder=\"Search by ID or name...\">\n            <select id=\"lectureFilter\">\n                <option value=\"\">Select Lecture</option>\n                ";
  var courseOptions = '';
  courses.forEach(function (course) {
    courseOptions += "<option value=\"".concat(course.id, "\">").concat(course.name, "</option>");
  });
  searchForm += courseOptions;
  searchForm += "</select>\n    <select id=\"gradeFilter\">\n        <option value=\"\">Grade Status</option>\n        <option value=\"pass\">Pass</option>\n        <option value=\"fail\">Fail</option>\n    </select>\n        <button type=\"button\" id=\"searchBtn\">Search</button>\n    </form>\n    <div id=\"results\"></div>\n    ";
  mainContent.appendChild(searchDiv);
  searchDiv.innerHTML = searchForm;
  document.getElementById('searchBtn').addEventListener('click', function () {
    var idOrNameInput = document.getElementById('searchInput').value;
    var courseIdfilter = document.getElementById('lectureFilter').value;
    var gradeStatusFilter = document.getElementById('gradeFilter').value;
    var searchModel = generateSearchModel(idOrNameInput, courseIdfilter, gradeStatusFilter);
    results = searchLogic(searchModel);
    displayResultsInTable(results);
  });
} // Displays the search results


function displayResultsInTable(results) {
  var resultsDiv = document.getElementById('results'); // Clear previous results

  resultsDiv.innerHTML = ''; // Create a table

  var table = document.createElement('table');
  table.style.width = '100%';
  table.setAttribute('border', '1'); // Create table header

  var thead = table.createTHead();
  var headerRow = thead.insertRow();
  var headers = ["NO", "Student ID", "Student Name", "Course", "Grade", "GPA"];
  headers.forEach(function (headerText) {
    var headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  }); // Create table body

  var tbody = table.createTBody();
  counter = 1;
  results.forEach(function (_ref) {
    var student = _ref.student,
        courseName = _ref.courseName;
    var row = tbody.insertRow();

    if (student.letter == "F") {
      row.style.backgroundColor = '#FF000060';
    }

    row.insertCell().textContent = counter;
    row.insertCell().textContent = student.id;
    row.insertCell().textContent = "".concat(student.name, " ").concat(student.surname);
    row.insertCell().textContent = courseName;
    row.insertCell().textContent = student.letter;
    row.insertCell().textContent = calculateGPA(student);
    counter++;
  });
  console.log(results[0].student);
  calculateGPA(results[0].student); // Append the table to resultsDiv

  resultsDiv.appendChild(table);
} // Creates a search model JSON object according to user's filter


function generateSearchModel(idOrNameInput, courseIdfilter, gradeStatusFilter) {
  console.log('Generating the search model...');
  searchModel = {}; // Set main search input

  if (idOrNameInput) {
    searchModel.input = idOrNameInput;
    console.log('burada');
    console.log(idOrNameInput);
  } else {
    searchModel.input = '';
  } // Set courseId for SearchModel


  if (courseIdfilter) {
    searchModel.courseId = Number(courseIdfilter);
  } // Set Grade status for SearchModel


  if (gradeStatusFilter) {
    if (gradeStatusFilter === 'pass') {
      gradeStatus = true;
    } else if (gradeStatusFilter === 'fail') {
      gradeStatus = false;
    }

    searchModel.gradeStatus = gradeStatus;
  } else {
    searchModel.gradeStatus = null;
  }

  return searchModel;
}

function searchLogic(searchModel) {
  console.log('search');
  var courses = JSON.parse(localStorage.getItem('lectures'));
  results = [];
  courses.forEach(function (course) {
    var courseName = course.name;

    if (searchModel.courseId && searchModel.courseId !== course.id) {
      return; // Skip courses which course id does not match
    }

    course.students.forEach(function (student) {
      // If searchModel input does not includes in student name/id
      if (!searchModel.input) {
        // If gradeFilter does not set, pass the student to results
        if (searchModel.gradeStatus === null) {
          results.push({
            courseName: courseName,
            student: student
          });
        } else if (searchModel.gradeStatus === false) {
          if (student.letter === 'F') {
            results.push({
              courseName: courseName,
              student: student
            });
          } else {
            return;
          }
        } else if (searchModel.gradeStatus === true) {
          if (student.letter !== 'F') {
            results.push({
              courseName: courseName,
              student: student
            });
          } else {
            return;
          }
        }
      } else {
        // If input is alpha-numeric, check Student Name else check Student ID
        if (!isNumeric(searchModel.input)) {
          studentNameSurname = student.name.toString().toLowerCase() + student.surname.toString().toLowerCase();
          studentNameSurname.toLowerCase();

          if (studentNameSurname.includes(searchModel.input.toString().toLowerCase())) {
            // If gradeFilter does not set, pass the student to results
            if (searchModel.gradeStatus === null) {
              results.push({
                courseName: courseName,
                student: student
              });
            } else {
              if (searchModel.gradeStatus === false) {
                if (student.letter === 'F') {
                  results.push({
                    courseName: courseName,
                    student: student
                  });
                } else {
                  return;
                }
              } else if (searchModel.gradeStatus === true) {
                if (student.letter !== 'F') {
                  results.push({
                    courseName: courseName,
                    student: student
                  });
                } else {
                  return;
                }
              }
            }
          }
        } else {
          if (student.id.toString().toLowerCase().includes(searchModel.input.toString().toLowerCase())) {
            // If gradeFilter does not set, pass the student to results
            if (searchModel.gradeStatus === null) {
              results.push({
                courseName: courseName,
                student: student
              });
            } else {
              if (searchModel.gradeStatus === false) {
                if (student.letter === 'F') {
                  results.push({
                    courseName: courseName,
                    student: student
                  });
                } else {
                  return;
                }
              } else if (searchModel.gradeStatus === true) {
                if (student.letter !== 'F') {
                  results.push({
                    courseName: courseName,
                    student: student
                  });
                } else {
                  return;
                }
              }
            }
          }
        }
      }
    });
  });
  return results;
} // Checks given string is numeric or alphanumeric


function isNumeric(str) {
  // Regular expression for numeric only
  var numericRegex = /^[0-9]+$/;
  return numericRegex.test(str);
}