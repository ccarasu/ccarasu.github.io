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

// fetchNotices 함수
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

// 검색 기능 추가
document.getElementById("search-btn").addEventListener("click", function() {
  const searchTerm = document.getElementById("search").value.trim();
  const searchType = document.querySelector('input[name="selector"]:checked').nextSibling.nodeValue.trim(); // 선택된 검색 항목
  searchNotices(searchTerm, searchType);
});

// 엔터키로도 검색 가능하도록 수정
document.getElementById("search").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {  // 엔터키를 누르면
    const searchTerm = document.getElementById("search").value.trim();
    const searchType = document.querySelector('input[name="selector"]:checked').nextSibling.nodeValue.trim();
    searchNotices(searchTerm, searchType);
  }
});

// notices 데이터 검색 함수
function searchNotices(searchTerm, searchType) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // 기존 테이블 내용 초기화

  onValue(noticesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const noticesArray = Object.values(data);
      const filteredNotices = [];

      for (const notice of noticesArray) {
        // 검색 항목에 따라 필터링
        if (searchType === "전체") {
          // 제목 + 내용에서 모두 검색
          if (notice.subject.includes(searchTerm) || notice.content.includes(searchTerm)) {
            filteredNotices.push(notice);
          }
        } else if (searchType === "제목") {
          if (notice.subject.includes(searchTerm)) {
            filteredNotices.push(notice);
          }
        } else if (searchType === "내용") {
          if (notice.content.includes(searchTerm)) {
            filteredNotices.push(notice);
          }
        }
      }

      // 필터링된 공지사항 결과 테이블에 출력
      if (filteredNotices.length > 0) {
        filteredNotices.forEach((notice, index) => {
          tbody.innerHTML += template(index, notice);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5">검색된 공지사항이 없습니다.</td></tr>`;
      }

    } else {
      console.log("No data available");
    }
  }, (error) => {
    console.log("Error fetching data:", error);
  });
}

// 페이지 로드 시 notices 데이터를 가져옵니다.
fetchNotices();

// 모바일 메뉴 관련 기능
$(function() {
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open");
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open");
    $("body").css("overflow", "auto");
  });
  
  $(".back-button").click(function () {
    history.back();
  });
});
