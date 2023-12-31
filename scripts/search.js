// Sets the inner.HTML for Advanced Search option
function loadSearch(){
    mainContent.innerHTML = '';
    searchDiv = document.createElement('div');
    courses = JSON.parse(localStorage.getItem('lectures'))
    searchForm = `
    <form id="searchForm">
            <input type="text" id="searchInput" placeholder="Search by ID or name...">
            <select id="lectureFilter">
                <option value="">Select Lecture</option>
                `;
    let courseOptions = '';
    courses.forEach(course => {
        courseOptions += `<option value="${course.id}">${course.name}</option>`;
    });
    searchForm += courseOptions;
    searchForm += `</select>
    <select id="gradeFilter">
        <option value="">Grade Status</option>
        <option value="pass">Pass</option>
        <option value="fail">Fail</option>
    </select>
        <button type="button" id="searchBtn">Search</button>
    </form>
    <div id="results"></div>
    `;
    
    mainContent.appendChild(searchDiv);
    searchDiv.innerHTML = searchForm;

    document.getElementById('searchBtn').addEventListener('click', function (){
        let idOrNameInput = document.getElementById('searchInput').value;
        let courseIdfilter = document.getElementById('lectureFilter').value;
        let gradeStatusFilter = document.getElementById('gradeFilter').value;

        let searchModel = generateSearchModel(idOrNameInput, courseIdfilter, gradeStatusFilter);
        results = searchLogic(searchModel);
        displayResultsInTable(results);

    });
}

// Displays the search results
function displayResultsInTable(results) {
    let resultsDiv = document.getElementById('results');
    
    // Clear previous results
    resultsDiv.innerHTML = '';

    // Create a table
    let table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    
    // Create table header
    let thead = table.createTHead();
    let headerRow = thead.insertRow();
    let headers = ["NO","Student ID", "Student Name", "Course", "Grade", "GPA"];
    headers.forEach(headerText => {
        let headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    // Create table body
    let tbody = table.createTBody();
    counter = 1;
    results.forEach(({ student, courseName }) => {
        let row = tbody.insertRow()
        if (student.letter == "F"){
            row.style.backgroundColor = '#FF000060';
        }
        row.insertCell().textContent = counter;
        row.insertCell().textContent = student.id;
        row.insertCell().textContent = `${student.name} ${student.surname}`;
        row.insertCell().textContent = courseName;
        row.insertCell().textContent = student.letter;
        row.insertCell().textContent = calculateGPA(student);
        counter++;
    });

    console.log(results[0].student);
    calculateGPA(results[0].student);

    // Append the table to resultsDiv
    resultsDiv.appendChild(table);
}

// Creates a search model JSON object according to user's filter
function generateSearchModel(idOrNameInput, courseIdfilter, gradeStatusFilter){
    console.log('Generating the search model...');
    searchModel = {};
    
    // Set main search input
    if (idOrNameInput){
        searchModel.input = idOrNameInput;
        console.log('burada');
        console.log(idOrNameInput);
    } else {
        searchModel.input = '';
    }
    

    // Set courseId for SearchModel
    if (courseIdfilter){
        searchModel.courseId = Number(courseIdfilter);
    }

    // Set Grade status for SearchModel
    if(gradeStatusFilter){
        if (gradeStatusFilter === 'pass'){
            gradeStatus = true;
        } else if (gradeStatusFilter === 'fail'){
            gradeStatus = false;
        } 
        searchModel.gradeStatus = gradeStatus;
    } else {
        searchModel.gradeStatus = null;
    }
    return searchModel;
}

function searchLogic(searchModel){
    console.log('search');
    let courses = JSON.parse(localStorage.getItem('lectures'));
    results = []
    courses.forEach(course => {
        let courseName = course.name;
        if(searchModel.courseId && searchModel.courseId !== course.id){
            return; // Skip courses which course id does not match
        }
        course.students.forEach(student => {
            // If searchModel input does not includes in student name/id
            if (!searchModel.input){
                // If gradeFilter does not set, pass the student to results
                if(searchModel.gradeStatus === null){
                    results.push({ courseName, student });
                } else if(searchModel.gradeStatus === false){
                    if (student.letter === 'F'){
                        results.push({courseName, student});
                    } else {
                        return
                    }
                }else if (searchModel.gradeStatus === true) {
                    if(student.letter !== 'F') {
                        results.push({ courseName, student });
                    } else {
                        return
                    }
                }
                
            } else {
                // If input is alpha-numeric, check Student Name else check Student ID
                if(!isNumeric(searchModel.input)){
                    studentNameSurname = (student.name.toString().toLowerCase() + student.surname.toString().toLowerCase());
                    studentNameSurname.toLowerCase();
                    if(studentNameSurname.includes(searchModel.input.toString().toLowerCase())){
                        // If gradeFilter does not set, pass the student to results
                       
                        if(searchModel.gradeStatus === null){
                            results.push({ courseName, student });
                        } else {
                            if(searchModel.gradeStatus === false){
                                if (student.letter === 'F'){
                                    results.push({ courseName, student });
                                } else {
                                    return
                                }
                            } else if (searchModel.gradeStatus === true) {
                                if(student.letter !== 'F') {
                                    results.push({ courseName, student });
                                } else {
                                    return
                                }
                            }
                        }
                    }
                } else {
                    if (student.id.toString().toLowerCase().includes(searchModel.input.toString().toLowerCase())) {
                        // If gradeFilter does not set, pass the student to results
                if(searchModel.gradeStatus === null){
                    results.push({ courseName, student });
                } else {
                    if(searchModel.gradeStatus === false){
                        if (student.letter === 'F'){
                             results.push({ courseName, student });
                        } else {
                            return
                        }
                    } else if (searchModel.gradeStatus === true) {
                        if(student.letter !== 'F') {
                            results.push({ courseName, student });
                        } else {
                            return
                        }
                    }
                }
                    }
                }
            }
            
        });
    });
    return results; 
}

// Checks given string is numeric or alphanumeric
function isNumeric(str) {
    // Regular expression for numeric only
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(str);
}