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

const noticesStr = localStorage.getItem("notices");
const noticesObj =  JSON.parse(noticesStr);

const idx = location.search;  
const index = idx.split("=")[1];  // 인덱스 숫자값만 가져오기
const notice = noticesObj[index];

const beforeUrl = document.referrer;

//조회수
if (!notice.refresh) {
  notice.views++;
  notice.refresh = true;
  const viewCountStr = JSON.stringify(noticesObj);
  localStorage.setItem("notices",viewCountStr);
} else {
  if (beforeUrl === " ") {
    notice.views++;
    const viewCountStr = JSON.stringify(noticesObj);
    localStorage.setItem("notices", viewCountStr);
  }
}

//데이터 출력
const viewForm = document.querySelectorAll("#ViewForm > div");

for (let i = 0; i<viewForm.length; i++)
{
  const id = viewForm[i].id;
  viewForm[i].innerHTML += "" + notice[id];
}

const modifyBtn = document.querySelector("#modify");

const modifyBtnHandler = (e) => {
  location = "notice-modify.html" + idx;
};

modifyBtn.addEventListener("click", modifyBtnHandler);

//삭제 버튼
const deleteBtn = document.querySelector("#delete");

const deleteBtnHandler = (e) => {
  noticesObj.splice(index, 1);
  for (let i=0; i < noticesObj.length; i++)
  {
    noticesObj[i].index = i;
  }
  const setNoticeStr = JSON.stringify(noticesObj);
  localStorage.setItem("notices", setNoticeStr);
  location.href = "notice.html";
};

deleteBtn.addEventListener("click", deleteBtnHandler);