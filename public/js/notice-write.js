import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
import { getDatabase, ref, push, set, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
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

// Notice 클래스 정의
class Notice {
  constructor(subjectstr, contentStr, index) {
    this.index = index || 0;  // index 값은 파라미터로 받아옴
    this.subject = subjectstr || "";  // 빈 문자열 기본값 설정
    this.writer = "admin";  // writer는 항상 "admin"으로 고정
    this.content = contentStr || "";  // 빈 문자열 기본값 설정
    this.date = recordDate();
    this.views = 0;  // 기본값 설정
    this.refresh = false;
  }

  // 값 설정 시 빈 값 체크
  set Subject(value) {
    if (value.length === 0) throw new Error("제목을 입력해주세요.");
    this.subject = value;
  }

  set Content(value) {
    if (value.length === 0) throw new Error("내용을 입력해주세요.");
    this.content = value;
  }
}

//글 작성 버튼
const submitHandler = async (e) => {
  e.preventDefault();

  const subject = e.target.subject.value;
  const content = e.target.content.value;

  try {
    // Firebase에서 현재 공지사항 목록 가져오기
    const noticesRef = ref(database, "notices");
    const snapshot = await get(noticesRef);
    const noticesObj = snapshot.exists() ? snapshot.val() : [];

    // 기존 공지사항들의 index 값 중 가장 큰 값 찾기
    let newIndex = 0;  // 기본값 0
    if (noticesObj) {
      const indexes = Object.values(noticesObj).map(notice => notice.index);
      newIndex = indexes.length > 0 ? Math.max(...indexes) + 1 : 0;  // 가장 큰 index 값에 1을 더한 값 사용
    }

    // 새로운 공지사항 객체 생성
    const instance = new Notice(subject, content, newIndex);
    
    // Firebase에 새 공지사항 추가
    const newNoticeRef = push(noticesRef); // 고유 키로 데이터 추가
    await set(newNoticeRef, instance);

    // 성공적으로 저장된 경우 상세 페이지로 이동 (key 값 전달)
    location.href = "notice-view.html?key=" + newNoticeRef.key; // 고유 키로 이동
  } catch (e) {
    // 예외 발생 시 메시지 출력
    alert(e.message);
    console.error(e);
  }
};

// 폼 이벤트 리스너 추가
const writeForm = document.querySelector("#writeForm");
writeForm.addEventListener("submit", submitHandler);

// 햄버거 메뉴 처리
$(function () {
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open");
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open");
    $("body").css("overflow", "auto");
  });
});
