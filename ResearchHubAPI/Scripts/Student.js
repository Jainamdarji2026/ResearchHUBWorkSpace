function GetAllStudent() {
    var settings = {
        "url": "https://localhost:44342/api/Student",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

// Auto-load when Student.html is opened — robust DOM ready handling
(function () {
    function tryLoad() {
        try {
                GetAllStudent();
        } catch (e) {
            console.error('Error calling GetAllStudent on load', e);
        }
    }

    if (window.jQuery) {
        // prefer jQuery ready if available
        $(tryLoad);
    } else if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // DOM already ready
        tryLoad();
    } else {
        document.addEventListener('DOMContentLoaded', tryLoad);
    }
})();
    $.ajax(settings).done(function (response) {
        console.log(response);
        // Bind JSON response to the table in Student.html
        try {
            var $tbody = $("#employeeList tbody");
            $tbody.empty();
            if (Array.isArray(response)) {
                response.forEach(function (s) {
                    var name = s.student_name || '';
                    var email = s.email || ''; // API may not return email
                    var roll = s.student_roll_no || '';
                    var div = s.student_div || '';

                    var $tr = $("<tr></tr>");
                    $tr.append($("<td></td>").text(name));
                    $tr.append($("<td></td>").text(email));
                    $tr.append($("<td></td>").text(roll));
                    $tr.append($("<td></td>").text(div));

                    var $actions = $("<td></td>");
                    // Edit link: call onEdit if present (expects TD element)
                    var $edit = $("<a href=\"javascript:void(0)\">Edit</a>");
                    $edit.on('click', function () {
                        if (typeof onEdit === 'function') {
                            // create a fake td element pointing to this row for compatibility
                            onEdit(this);
                        } else if (typeof onEditRow === 'function') {
                            onEditRow(roll);
                        } else {
                            console.log('Edit clicked for', roll);
                        }
                    });

                    var $del = $("<a href=\"javascript:void(0)\">Delete</a>");
                    $del.css('margin-left', '8px');
                    $del.on('click', function () {
                        if (typeof onDelete === 'function') {
                            onDelete(this);
                        } else if (typeof onDeleteRow === 'function') {
                            onDeleteRow(roll, function () { $tr.remove(); });
                        } else {
                            // default: remove row
                            $tr.remove();
                        }
                    });

                    $actions.append($edit).append($del);
                    $tr.append($actions);

                    $tbody.append($tr);
                });
            } else {
                // if response is a single object, show one row
                var s = response;
                if (s && typeof s === 'object') {
                    var $tr = $("<tr></tr>");
                    $tr.append($("<td></td>").text(s.student_name || ''));
                    $tr.append($("<td></td>").text(s.email || ''));
                    $tr.append($("<td></td>").text(s.student_roll_no || ''));
                    $tr.append($("<td></td>").text(s.student_div || ''));
                    $tr.append($("<td></td>").text(''));
                    $tbody.append($tr);
                }
            }
        } catch (e) {
            console.error('Error binding students to table', e);
        }
    });
}