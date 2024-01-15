const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


//셀 생성
class Cell {
  constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.rowName = rowName;
    this.column = column;
    this.columnName = columnName;
    this.active = active;
  }
}

//엑셀 스프레드 시트 내보내기
exportBtn.onclick = function(e) {
  let csv = "";
  for(let i = 0; i < spreadsheet.length; i++) {
    if(i === 0) continue;
    csv +=
      spreadsheet[i]
        //헤더를 걸러주고
        .filter(item => !item.isHeader)
        //아이템 데이터만 리턴
        .map(item => item.data)
        //csv 데이터 형식에 맞게 콤마로 구분
        .join(',') + "\r\n";
      }
      console.log("csv", csv);
      
      const csvObj = new Blob([csv]);
      const csvUrl = URL.createObjectURL(csvObj);
      console.log('csvUrl', csvUrl);
      
      const a = document.createElement("a");
      a.href = csvUrl;
      a.download = 'spreadsheet name.csv';
      a.click();
}

initSpreadsheet();

//1행 ~ 10행까지 10x10
function initSpreadsheet() {
  //0-0 0-1 0-2 0-3 0-4 0-5... 나열
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = []
    //0-10까지 나열후에 1-0부터 시작
    for (let j = 0; j < COLS; j++) {
      // 내용을 공백으로
      let cellData = '';
      let isHeader = false;
      let disabled = false;
      
      //모든 row 첫 번째 Column에 숫자 넣기
      if(j === 0) {
        cellData = i;
        //첫 번째 row header 지정
        isHeader = true;
        //첫 번째 행 수정이 불가하게
        disabled = true;

      }
      //모든 column 첫 번째 영어 넣기
      if(i === 0) {
        cellData = alphabets[j - 1];
        //첫 번째 column header 지정
        isHeader = true;
        //첫 번째 열 수정이 불가하게
        disabled = true;

      }
      //0-0을 공백으로
      if (!cellData) {
        cellData = ""; 
      }


      //첫 번째 row의 Column에 공백;
      if(cellData <= 0) {
        cellData = "";
      }
      
      //행열 이름 지정하기
      const rowName = i;
      const columnName = alphabets[j - 1];

      //각각의 셀을 객체데이터로 넣어주기
      const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
      spreadsheetRow.push(cell)
    }
    spreadsheet.push(spreadsheetRow);
  }
  //실제 렌더링 호출
  drawSheet();
  // console.log(spreadsheet);
}

//실제 셀 생성하기
function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  //해더 부분의 클래스 이름을 Cell header로
  if(cell.isHeader) {
    cellEl.classList.add("header");
  }
  
  //셀 클릭 할 때 어느 행 열을 클릭 했는지 로그 띄우기
  cellEl.onclick = () => handCellClick(cell);
  //셀 내용이 변한 내용 가져오기 
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl
}

//셀 내용에서 변한 내용 저장하기
function handleOnChange(data, cell) {
  cell.data = data;
}

function handCellClick(cell) {
  //헤더 하이라이트 제거 호출
  clearHeaderActiveStates();
  //클릭한 셀에 대한 행열 객체 데이터 가져오기
  const columnHeader = spreadsheet[0] [cell.column];
  const rowHeader = spreadsheet[cell.row] [0];
  //각각 헤더에 해당하는 부분 가져오기
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

  //선택된 셀 행열에 해당하는 헤더에 하이라이트
  columnHeaderEl.classList.add("active")
  rowHeaderEl.classList.add("active")
  //현재 선택된 셀 표시
  document.querySelector("#cell-status").innerHTML = cell.columnName + "" + cell. rowName;
}

//이전 헤더의 하이라이트 제거
function clearHeaderActiveStates() {
  const headers = document.querySelectorAll('.header');
  //모든 헤더에서 활성화 속성 지우기
  headers.forEach((header) => {
    header.classList.remove('active');
  })

}

function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

//셀 렌더링하기
function drawSheet() {
  //0-0 ~ 9-9까지 반복
  for(let i =0; i < spreadsheet.length; i++) {
    ////10개의 셀을 하나의 row div에 속하게
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for(let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}