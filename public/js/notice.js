// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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
const db = getDatabase(app);
const noticesRef = ref(db, "notices");

$(function() {
  // 햄버거 메뉴 열기/닫기
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open"); // nav-menu에 'open' 클래스를 토글하여 메뉴 열고 닫기
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  // X 버튼 클릭 시 메뉴 닫기
  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open"); // nav-menu에서 'open' 클래스를 제거하여 메뉴 닫기
    $("body").css("overflow", "auto"); // 메뉴가 닫히면 body의 overflow를 'auto'로 복원하여 스크롤이 가능하도록 함
  });
  
  // 뒤로 가기 버튼
  $(".back-button").click(function () {
    history.back();
  });
});

// 템플릿 생성
const template = (index, objValue) => {
  return `
    <tr>
      <td>${index + 1}</td>
      <td><a href="notice-view.html?index=${objValue.index}">${objValue.subject}</a></td>
      <td>${objValue.writer}</td>
      <td>${objValue.date}</td>
      <td>${objValue.views}</td>
    </tr>
  `;
};

function fetchNotices() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // 기존 테이블 내용 초기화

  onValue(noticesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const noticesArray = Object.values(data);
      noticesArray.forEach((notice, index) => {
        tbody.innerHTML += template(index, notice);
      });
    } else {
      console.log("No data available");
    }
  }, (error) => {
    console.log("Error fetching data:", error);
  });
}

fetchNotices();  // 페이지 로드 시 notices 데이터를 가져옵니다.
