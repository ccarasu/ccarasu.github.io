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

const modifyForm = document.querySelector("#modifyForm");
const modifyFormList = document.querySelectorAll("#modifyForm > div");
const idx = location.search;
const index = location.search.split("=")[1];
const noticesObj = JSON.parse(localStorage.getItem("notices"));
const notice = noticesObj[index];

//게시글의 데이터 값 출력
for (let i=0; i< modifyFormList.length; i++) {
  const element = modifyFormList[i].childNodes[1];
  const id = element.name;
  element.value = notice[id];
}

//작성한 입력 값이 빈 값인지 검사
const isEmpty = (subject, writer, content) => {
  if (subject.length === 0) throw new Error("제목을 입력해주세요");
  if (writer.length === 0) throw new Error("작성자를 입력해주세요");
  if (content.length === 0) throw new Error("내용을 입력해주세요");
};

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
const modifyHandler = (e) => {
  e.preventDefault();
  const subject = e.target.subject.value;
  const writer = e.target.writer.value;
  const content = e.target.content.value;

  try {
    isEmpty(subject, writer, content);
    notice.subject = subject;
    notice.writer = writer;
    notice.content = content;
    notice.date = recordDate();

    const noticesStr = JSON.stringify(noticesObj);
    localStorage.setItem("notices", noticesStr);
    location.href = "notice-view.html" + idx;
  } catch (e) {
    alert(e.message);
    console.error(e);
  }
};

const backBtn = document.querySelector("#back");

//뒤로가기 버튼
const backBtnHandler = (e) => {
  location.href = document.referrer;
};

modifyForm.addEventListener("submit", modifyHandler);
backBtn.addEventListener("click", backBtnHandler);