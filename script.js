// Gán sự kiện onchange cho các trường input
document.getElementById("StartTimeTextBox").addEventListener("change", calculate);
document.getElementById("EndTimeTextBox").addEventListener("change", calculate);
document.getElementById("CheckBox1").addEventListener("change", calculate);
document.getElementById("CheckBox2").addEventListener("change", calculate);

// Hàm tính toán
function calculate() {
  //Lấy giá trị từ TextBox cho thời gian bắt đầu và kết thúc
  var startTime = new Date("2000-01-01T" + document.getElementById("StartTimeTextBox").value + ":00Z");
  var endTime = new Date("2000-01-01T" + document.getElementById("EndTimeTextBox").value + ":00Z");

  //Kiểm tra nếu thời gian kết thúc nhỏ hơn thời gian bắt đầu thì cộng 1 ngày cho thời gian kết thúc
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  //Tính số giờ công dựa trên thời gian bắt đầu và kết thúc
  var workingHours = (endTime - startTime) / (1000 * 60 * 60);
  workingHours = Math.round(workingHours * 100) / 100;

  //Tính số giờ làm việc thực tế
  var actualHours = workingHours;

  if (document.getElementById("CheckBox1").checked && document.getElementById("CheckBox2").checked) {
    actualHours = actualHours - 2.5;
  } else if (document.getElementById("CheckBox1").checked) {
    actualHours = actualHours - 1.5;
  } else if (document.getElementById("CheckBox2").checked) {
    actualHours = actualHours - 1;
  }

  //Tính số giờ làm việc tăng ca
  var overtimeHours = 0;
  if (actualHours > 8) {
    overtimeHours = actualHours - 8;
  }

  //Tính số giờ làm việc ban đêm
  var nightShiftHours = 0;
  var endTimeNightShift = new Date("2000-01-01T22:00:00Z");
  if (endTime > endTimeNightShift) {
    nightShiftHours = (endTime - endTimeNightShift) / (1000 * 60 * 60);
    nightShiftHours = Math.round(nightShiftHours * 100) / 100;
  }

  //Hiển thị kết quả trên TextBox
  document.getElementById("WorkingHoursLabel").value = actualHours;
  document.getElementById("OvertimeHoursLabel").value = overtimeHours;
  document.getElementById("NightShiftLabel").value = nightShiftHours;
}


var stt = 1; // Biến để lưu trữ giá trị STT

function getDataFromForm() {
  // Lấy dữ liệu từ các trường input
  var startTime = document.getElementById("StartTimeTextBox").value;
  var endTime = document.getElementById("EndTimeTextBox").value;
  var isBreakTime = document.getElementById("CheckBox1").checked;
  var isAfternoonOff = document.getElementById("CheckBox2").checked;
  var workingHours = parseFloat(document.getElementById("WorkingHoursLabel").value);
  var overtimeHours = parseFloat(document.getElementById("OvertimeHoursLabel").value);
  var nightShiftHours = parseFloat(document.getElementById("NightShiftLabel").value);

  // Kiểm tra giá trị của WorkingHoursLabel
  var ngayCong = isNaN(workingHours) || workingHours < 3.99? 0 : 1;

  // Thêm dữ liệu vào bảng
  var tableBody = document.querySelector(".table tbody");
  var row = document.createElement("tr");
  var cell1 = document.createElement("td");
  var cell2 = document.createElement("td");
  var cell3 = document.createElement("td");
  var cell4 = document.createElement("td");
  var cell5 = document.createElement("td");
  var cell6 = document.createElement("td");

  cell1.textContent = stt++;
  cell2.textContent = startTime + " ~ " + endTime;
  cell3.textContent = ngayCong;
  cell4.textContent = !isNaN(workingHours) && workingHours > 0 ? workingHours : "";
  cell5.textContent = isNaN(overtimeHours) ? "" : overtimeHours;
  cell6.textContent = isNaN(nightShiftHours) ? "" : nightShiftHours;

  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);
  row.appendChild(cell4);
  row.appendChild(cell5);
  row.appendChild(cell6);

  tableBody.appendChild(row);

  // Di chuyển hàng tổng cộng khi có dữ liệu
  moveTotalRow();

  // Tính tổng cộng
  calculateTotal();
 // add delete button to the new row
  addDeleteButtonToRow();
}

function calculateTotal() {
  var tableBody = document.querySelector(".table tbody");
  var rows = tableBody.querySelectorAll("tr");
  var totalWorkingHours = 0;
  var totalOvertimeHours = 0;
  var totalNightShiftHours = 0;
  var totalWorkingDays = 0;

  for (var i = 0; i < rows.length - 1; i++) {
    var row = rows[i];
    var workingDaysCell = row.querySelector("td:nth-child(2)");
    var workingHoursCell = row.querySelector("td:nth-child(3)");
    var overtimeHoursCell = row.querySelector("td:nth-child(4)");
    var nightShiftHoursCell = row.querySelector("td:nth-child(5)");

    var workingDays = parseFloat(workingDaysCell.textContent);
    var workingHours = parseFloat(workingHoursCell.textContent);
    var overtimeHours = parseFloat(overtimeHoursCell.textContent);
    var nightShiftHours = parseFloat(nightShiftHoursCell.textContent);

    if (!isNaN(workingDays) && workingDays > 0) {
      totalWorkingDays += workingDays;
    }

    if (!isNaN(workingHours)) {
      totalWorkingHours += workingHours;
    }

    if (!isNaN(overtimeHours)) {
      totalOvertimeHours += overtimeHours;
    }

    if (!isNaN(nightShiftHours)) {
      totalNightShiftHours += nightShiftHours;
    }
  }

  var totalWorkingHoursCell = document.getElementById("totalWorkingHoursCell");
  var totalOvertimeHoursCell = document.getElementById("totalOvertimeHoursCell");
  var totalNightShiftHoursCell = document.getElementById("totalNightShiftHoursCell");
  var totalWorkingDaysCell = document.getElementById("totalWorkingDaysCell");

  totalWorkingHoursCell.textContent = totalWorkingHours.toFixed(1);
  totalOvertimeHoursCell.textContent = totalOvertimeHours.toFixed(1);
  totalNightShiftHoursCell.textContent = totalNightShiftHours.toFixed(1);
  totalWorkingDaysCell.textContent = totalWorkingDays;

  moveTotalRow();
}




function moveTotalRow() {
  var tableBody = document.querySelector(".table tbody");
  var totalRow = document.getElementById("totalRow");

  // Remove the total row from its current position
  tableBody.removeChild(totalRow);

  // Insert the total row at the end of the table
  tableBody.appendChild(totalRow);
}


function addDeleteButtonToRow() {
  var rows = tableBody.querySelectorAll("tr:not(#totalRow)");

  rows.forEach(function(row) {
    // Check if delete button is already added to the row
    if (!row.querySelector(".delete-button")) {
      var deleteButtonCell = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "X";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", function() {
        deleteRow(row);
      });

      deleteButtonCell.appendChild(deleteButton);
      row.appendChild(deleteButtonCell);
    }
  });
}


function deleteRow(row) {
  tableBody.removeChild(row);
  calculateTotal();
  moveTotalRowToTop();
}

function clearTableData() {
  var tableBody = document.querySelector(".table tbody");
  var totalRow = document.getElementById("totalRow");
  
  // Lấy giá trị của hàng tổng cộng
  var totalWorkingDaysCell = document.getElementById("totalWorkingDaysCell").textContent;
  var totalWorkingHoursCell = document.getElementById("totalWorkingHoursCell").textContent;
  var totalOvertimeHoursCell = document.getElementById("totalOvertimeHoursCell").textContent;
  var totalNightShiftHoursCell = document.getElementById("totalNightShiftHoursCell").textContent;

  tableBody.innerHTML = ""; // Xóa nội dung trong tbody, làm rỗng bảng

  // Thêm lại hàng tổng cộng vào bảng
  tableBody.appendChild(totalRow);

  // Cập nhật giá trị hàng tổng cộng
  document.getElementById("totalWorkingDaysCell").textContent = totalWorkingDaysCell;
  document.getElementById("totalWorkingHoursCell").textContent = totalWorkingHoursCell;
  document.getElementById("totalOvertimeHoursCell").textContent = totalOvertimeHoursCell;
  document.getElementById("totalNightShiftHoursCell").textContent = totalNightShiftHoursCell;

  stt = 1; // Đặt lại giá trị STT về 1
}
