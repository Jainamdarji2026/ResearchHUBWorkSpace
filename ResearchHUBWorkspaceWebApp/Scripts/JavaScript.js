var selectedRow = null;

function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        // Map formData to API model
        var apiModel = {
            student_roll_no: parseInt(formData.rollNo, 10) || 0,
            student_name: formData.fullName,
            student_div: formData.division
        };

        if (selectedRow == null) {
            // Insert via API
            StudentAPI.insert(apiModel)
                .done(function () {
                    // still show email on client table (API doesn't store email in current model)
                    insertNewRecord(formData);
                })
                .fail(function (xhr) {
                    console.error('Insert failed', xhr);
                    alert('Insert failed. See console for details.');
                })
                .always(function () {
                    resetForm();
                });
        } else {
            // Update via API - use rollNo from the form or from selectedRow
            var id = parseInt(formData.rollNo, 10) || parseInt(selectedRow.cells[2].innerHTML, 10);
            StudentAPI.update(id, apiModel)
                .done(function () {
                    updateRecord(formData);
                })
                .fail(function (xhr) {
                    console.error('Update failed', xhr);
                    alert('Update failed. See console for details.');
                })
                .always(function () {
                    resetForm();
                });
        }
    }
}

function readFormData() {
    var formData = {};
    formData["fullName"] = document.getElementById("fullName").value;
    formData["email"] = document.getElementById("email").value;
    // Match input IDs in Default.aspx: rollNo and division
    formData["rollNo"] = document.getElementById("rollNo").value;
    formData["division"] = document.getElementById("division").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.email;
    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.rollNo;
    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.division;
    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a> <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("rollNo").value = "";
    document.getElementById("division").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("rollNo").value = selectedRow.cells[2].innerHTML;
    document.getElementById("division").value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.email;
    selectedRow.cells[2].innerHTML = formData.rollNo;
    selectedRow.cells[3].innerHTML = formData.division;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        var row = td.parentElement.parentElement;
        var roll = parseInt(row.cells[2].innerHTML, 10);
        if (!isNaN(roll)) {
            StudentAPI.remove(roll)
                .done(function () {
                    document.getElementById("employeeList").deleteRow(row.rowIndex);
                    resetForm();
                })
                .fail(function (xhr) {
                    console.error('Delete failed', xhr);
                    alert('Delete failed. See console for details.');
                });
        } else {
            // If roll is not a number, just remove from client table
            document.getElementById("employeeList").deleteRow(row.rowIndex);
            resetForm();
        }
    }
}

function validate() {
    var isValid = true;
    if (document.getElementById("fullName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}

// On page load, fetch existing students from API and populate the table
$(function () {
    // load students from API
    if (typeof StudentAPI !== 'undefined' && StudentAPI.getAll) {
        StudentAPI.getAll()
            .done(function (list) {
                if (Array.isArray(list)) {
                    list.forEach(function (s) {
                        var rowData = {
                            fullName: s.student_name || '',
                            email: '', // API model doesn't include email currently
                            rollNo: s.student_roll_no || '',
                            division: s.student_div || ''
                        };
                        insertNewRecord(rowData);
                    });
                }
            })
            .fail(function (xhr) {
                console.warn('Could not load students from API', xhr);
            });
    }
});
