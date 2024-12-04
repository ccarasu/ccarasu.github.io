$(function() {
  // 햄버거 메뉴 클릭 시 메뉴 열기/닫기
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open"); // nav-menu에 'open' 클래스를 토글하여 메뉴 열고 닫기
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  // X 버튼 클릭 시 메뉴 닫기
  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open"); // nav-menu에서 'open' 클래스를 제거하여 메뉴 닫기
    $("body").css("overflow", "auto"); // 메뉴가 닫히면 body의 overflow를 'auto'로 복원하여 스크롤이 가능하도록 함
  });
  
});

const writeForm = document.querySelector("#writeForm");

class Notice {
  constructor(indexNum, subjectstr, writeStr, contentStr) {
    this.index = indexNum;
    this.subject = subjectstr;
    this.writer = writeStr;
    this.content = contentStr;
    this.date = recordDate();
    this.views = -1;
    this.refresh = false;
  }
  
  //값 설정시 빈 값 체크
  set Subject(value) {
    if (value.length === 0) throw new Error("제목을 입력해주세요.");
    this.subject = value;
  }

  set Writer(value) {
    if (value.length === 0) throw new Error("작성자를 입력해주세요.");
    this.writer = value;
  }

  set Content(value) {
    if (value.length === 0) throw new Error("내용을 입력해주세요.");
    this.content = value;
  }
}

//현재 날짜 반환 함수
const recordDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? "" : 0) + mm;
  dd = (dd > 9 ? "" : 0) + dd;

  const arr = [yyyy, mm, dd];
  
  return arr.join("-");
}

//글작성 버튼
const submitHandler = (e) => {
  e.preventDefault();
  const subject = e.target.subject.value;
  const writer = e.target.writer.value;
  const content = e.target.content.value;

  try {
    //notices 가져오기
    const noticesObj = JSON.parse(localStorage.getItem("notices"));

    //객체 추가
    const index = noticesObj.length;
    const instance = new Notice(index, subject, writer, content);
    noticesObj.push(instance);

    //notices 저장
    const noticesStr = JSON.stringify(noticesObj);
    localStorage.setItem("notices", noticesStr);
    location.href = "notice-view.html?index=" + index;
  } catch (e) {
    //예외 발생시 메시지 출력
    alert(e.message);
    console.error(e);
  }
};

writeForm.addEventListener("submit", submitHandler);