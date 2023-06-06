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

// Hiển thị kết quả trên TextBox
  document.getElementById("WorkingHoursLabel").value = actualHours.toFixed(1);
  document.getElementById("OvertimeHoursLabel").value = overtimeHours.toFixed(1);
  document.getElementById("NightShiftLabel").value = nightShiftHours.toFixed(1);
}


var stt = 1; // Biến để lưu trữ giá trị STT
var maxRows = 32; // Số dòng tối đa cho phép

function getDataFromForm() {
  // Kiểm tra số lượng dòng trong bảng
  var rowCount = document.querySelectorAll(".table tbody tr").length;
  if (rowCount >= maxRows) {
    alert("Đã đạt tối đa " + maxRows + " dòng.");
    return;
  }

  // Lấy dữ liệu từ các trường input
  var startTime = document.getElementById("StartTimeTextBox").value;
  var endTime = document.getElementById("EndTimeTextBox").value;
  var isBreakTime = document.getElementById("CheckBox1").checked;
  var isAfternoonOff = document.getElementById("CheckBox2").checked;
  var workingHours = parseFloat(document.getElementById("WorkingHoursLabel").value);
  var overtimeHours = parseFloat(document.getElementById("OvertimeHoursLabel").value);
  var nightShiftHours = parseFloat(document.getElementById("NightShiftLabel").value);

  // Kiểm tra giá trị của WorkingHoursLabel
  var ngayCong = isNaN(workingHours) || workingHours < 3.99 ? 0 : 1;

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

  // Thêm nút xóa vào dòng mới
  addDeleteButtonToRow();
    // Cuộn màn hình đến dòng vừa thêm
    row.scrollIntoView();
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
    var workingDaysCell = row.querySelector("td:nth-child(3)");
    var workingHoursCell = row.querySelector("td:nth-child(4)");
    var overtimeHoursCell = row.querySelector("td:nth-child(5)");
    var nightShiftHoursCell = row.querySelector("td:nth-child(6)");

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
function printTable() {
  // Lấy đối tượng bảng
  var table = document.querySelector(".table");

  // Loại bỏ cột "X" khỏi bảng
  var deleteColumnIndex = 6; // Chỉ số cột "X" (đếm từ 0)
  var cells = table.querySelectorAll("td:nth-child(" + (deleteColumnIndex + 1) + ")");
  cells.forEach(function(cell) {
    cell.remove();
  });

  // Tạo cửa sổ mới để in
  var printWindow = window.open("", "_blank");

  // Thiết lập nội dung HTML và CSS trong cửa sổ in
  printWindow.document.open();
  printWindow.document.write("<html><head><title>Bảng Chấm Công</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(".table-container { background-color: #f0f0f0; padding: 20px; }");
  printWindow.document.write(".table { width: 100%; border-collapse: collapse; }");
  printWindow.document.write(".table th, .table td { padding: 8px; border: 1px solid #ccc; text-align: center; }");
  printWindow.document.write(".table th { background-color: #ddd; }");
  printWindow.document.write(".table #totalRow td { font-weight: bold; }");
  printWindow.document.write(".header { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; }");
  printWindow.document.write("@page { size: A4; margin: 0; }"); // Điều chỉnh kích thước trang in thành A4 và loại bỏ các khoảng trống
  printWindow.document.write("@media print { body { margin: 1cm; } }"); // Điều chỉnh khoảng cách lề in trong trường hợp in từ trình duyệt
  printWindow.document.write("@media print { .table-container { overflow: hidden; } }"); // Ẩn phần tử tràn ra ngoài trang in
  printWindow.document.write("</style>");
  printWindow.document.write("</head><body>");
  printWindow.document.write("<div class='table-container'>");
  printWindow.document.write("<h1 class='header'>Bảng Chấm Công</h1>");
  printWindow.document.write(table.outerHTML);
  printWindow.document.write("</div>");
  printWindow.document.write("</body></html>");
  printWindow.document.close();

  // In bảng
  printWindow.print();
}
