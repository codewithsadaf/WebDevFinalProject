"use strict";

// Fetch the data and load to localStorage
fetch('./data/lectures.json').then(function (response) {
  return response.json();
}).then(function (data) {
  localStorage.setItem('lectures', JSON.stringify(data));
})["catch"](function (error) {
  return console.error('Error fetching courses:', error);
}); // Calculates the letter grade of given curse according to course Final & Midterm rate

function calculateLetterGrade(course, current_midterm, current_final) {
  /*  90-100 A
      80-89 B
      70-79 C
      60-69 D
      0-59  F */
  final_rate = course["final"];
  midterm_rate = course.midterm;
  grade = current_midterm * (midterm_rate / 100) + current_final * (final_rate / 100);

  if (90 <= grade < 100) {
    return 'A';
  } else if (80 <= grade <= 89) {
    return 'B';
  } else if (70 <= grade <= 79) {
    return 'C';
  } else if (60 <= grade <= 69) {
    return 'D';
  } else {
    return 'F';
  }
} // Returns the GPA of the student


function calculateGPA(student) {
  // GPA: (grades * credits) / credits
  var takenCourses = [];
  var totalCredits = 0;
  var weightedGradesSum = 0;
  var allCourses = JSON.parse(localStorage.getItem('lectures')); // Find courses taken by the student and calculate total credits

  allCourses.forEach(function (course) {
    if (course.students.some(function (targetStudent) {
      return student.id === targetStudent.id;
    })) {
      takenCourses.push(course);
      totalCredits += course.credits;
    }
  }); // Calculate the weighted grade sum using a for loop

  for (var i = 0; i < takenCourses.length; i++) {
    var course = takenCourses[i];
    var studentCourseData = course.students.find(function (targetStudent) {
      return student.id === targetStudent.id;
    });

    if (studentCourseData) {
      var _final_rate = course["final"] / 100;

      var _midterm_rate = course.midterm / 100;

      var _grade = studentCourseData.midterm * _midterm_rate + studentCourseData["final"] * _final_rate;

      weightedGradesSum += _grade * course.credits;
    }
  } // Calculate GPA


  var gpa = totalCredits > 0 ? weightedGradesSum / totalCredits : 0;
  return gpa;
} // Set event listener for Manage Student element


document.getElementById('search').addEventListener('click', loadSearch); // Set event listener for Manage Courses element

document.getElementById('manage-courses').addEventListener('click', loadCourseManagement);