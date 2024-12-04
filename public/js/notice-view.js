// Firebase 초기화 (이미 초기화된 경우 생략 가능)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, remove, set, get} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
const firebaseConfig = {
  apiKey: "AIzaSyDwZIP7CNex9zvLckwM5xCf0iafsYfAQcE",
  authDomain: "basicweb-6group.firebaseapp.com",
  databaseURL: "https://basicweb-6group-default-rtdb.firebaseio.com",
  projectId: "basicweb-6group",
  storageBucket: "basicweb-6group.firebasestorage.app",
  messagingSenderId: "454084926465",
  appId: "1:454084926465:web:5c6c52bbe7c837632cf400",
  measurementId: "G-FHTJY0MMFG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

const idx = location.search;
const index = idx.split("=")[1]; // 인덱스 숫자값만 가져오기

// Firebase에서 notices 데이터 가져오기
const noticesRef = ref(database, 'notices');
get(noticesRef).then((snapshot) => {
  if (snapshot.exists()) {
    const noticesObj = snapshot.val();
    
    // 원하는 notice를 찾기 위한 변수
    let notice = null;
    let noticeKey = null;

    // noticesObj를 순회하면서 index와 일치하는 항목을 찾음
    for (const key in noticesObj) {
      if (noticesObj[key].index === parseInt(index)) {
        notice = noticesObj[key];
        noticeKey = key; // 해당 항목의 고유 key 저장
        break; // 원하는 데이터를 찾았으면 반복문 종료
      }
    }

    // notice가 null이 아니면 해당 데이터를 사용
    if (notice) {
      const beforeUrl = document.referrer;

      // 조회수 처리
      if (!notice.refresh) {
        notice.views++;
        notice.refresh = true;
        set(ref(database, `notices/${noticeKey}`), notice); // 해당 항목 업데이트
      } else {
        if (beforeUrl === " ") {
          notice.views++;
          set(ref(database, `notices/${noticeKey}`), notice); // 해당 항목 업데이트
        }
      }

      // 데이터 출력
      const viewForm = document.querySelectorAll("#ViewForm > div");

      for (let i = 0; i < viewForm.length; i++) {
        const id = viewForm[i].id;
        viewForm[i].innerHTML += "" + notice[id];
      }

      const modifyBtn = document.querySelector("#modify");

      const modifyBtnHandler = (e) => {
        location = "notice-modify.html" + idx;
      };

      modifyBtn.addEventListener("click", modifyBtnHandler);

      // 삭제 버튼
      const deleteBtn = document.querySelector("#delete");

      const deleteBtnHandler = (e) => {
        // notices에서 해당 항목 삭제
        remove(ref(database, `notices/${noticeKey}`)).then(() => {
          // 삭제 후 인덱스를 재조정
          get(noticesRef).then((snapshot) => {
            if (snapshot.exists()) {
              const updatedNotices = snapshot.val();
              let i = 0;
              for (const key in updatedNotices) {
                updatedNotices[key].index = i++;
              }
              // notices 재저장
              set(noticesRef, updatedNotices).then(() => {
                location.href = "notice.html";
              });
            }
          });
        });
      };

      deleteBtn.addEventListener("click", deleteBtnHandler);

    } else {
      console.log("Notice not found for index:", index);
    }

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
