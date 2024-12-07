import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, update, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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
const auth = getAuth(app);

const loginLink = $("#login-link");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 로그인한 경우: 마이페이지로 이동
    loginLink.attr("href", "pages/mypage.html"); // 마이페이지 링크로 변경
  } else {
  // 로그인하지 않은 경우: 로그인 페이지로 이동
  loginLink.attr("href", "pages/login.html"); // 로그인 페이지 링크로 변경
  } 
});

// 햄버거 메뉴 처리
$(function() {
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open");
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open");
    $("body").css("overflow", "auto");
  });
});

const modifyForm = document.querySelector("#modifyForm");
const modifyFormList = document.querySelectorAll("#modifyForm > div");

// URL에서 key 값 추출
const urlParams = new URLSearchParams(location.search);
const key = urlParams.get("key");

if (!key) {
  console.log("Key not found in URL");
  location.href = "notice.html";  // 목록 페이지로 리다이렉션
}

// Firebase에서 notices 데이터 가져오기
const noticesRef = ref(database, 'notices');
get(noticesRef).then((snapshot) => {
  if (snapshot.exists()) {
    const noticesObj = snapshot.val();
    
    const notice = noticesObj[key];

    if (notice) {
      // 게시글의 데이터 값 출력
      for (let i = 0; i < modifyFormList.length; i++) {
        const element = modifyFormList[i].childNodes[1];
        const id = element.name;
        element.value = notice[id];
      }

      // 작성한 입력 값이 빈 값인지 검사
      const isEmpty = (subject, writer, content) => {
        if (subject.length === 0) throw new Error("제목을 입력해주세요");
        if (writer.length === 0) throw new Error("작성자를 입력해주세요");
        if (content.length === 0) throw new Error("내용을 입력해주세요");
      };

      // 현재 날짜 반환 함수
      const recordDate = () => {
        const date = new Date();
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        mm = (mm > 9 ? "" : 0) + mm;
        dd = (dd > 9 ? "" : 0) + dd;

        const arr = [yyyy, mm, dd];

        return arr.join("-");
      };

      const modifyHandler = (e) => {
        e.preventDefault();
        const subject = e.target.subject.value;
        const writer = e.target.writer.value;
        const content = e.target.content.value;

        try {
          isEmpty(subject, writer, content);

          // 공지사항 객체 수정
          notice.subject = subject;
          notice.writer = writer;
          notice.content = content;
          notice.date = recordDate();

          // Firebase에서 공지사항 업데이트
          update(ref(database, 'notices/' + key), notice).then(() => {
            location.href = "notice-view.html?key=" + key; // 수정된 후 상세 페이지로 이동
          }).catch((error) => {
            console.error("Error updating notice:", error);
            alert("공지사항 업데이트에 실패했습니다.");
          });

        } catch (e) {
          alert(e.message);
          console.error(e);
        }
      };

      const backBtn = document.querySelector("#back");

      // 뒤로가기 버튼
      const backBtnHandler = (e) => {
        const previousPage = document.referrer || "notice.html"; // 이전 페이지가 없으면 목록 페이지로 리다이렉션
        location.href = previousPage;
      };

      modifyForm.addEventListener("submit", modifyHandler);
      backBtn.addEventListener("click", backBtnHandler);

    } else {
      console.log("No notice found for key:", key);
    }
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
