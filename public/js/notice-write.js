import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
import { getDatabase, ref, push, set, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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

// 로그인 상태 변경 시 처리
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 로그인한 경우: 마이페이지로 이동
    loginLink.attr("href", "pages/mypage.html");

    // 사용자 역할 확인 (DB에서 사용자 정보 가져오기)
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.role !== 'admin') {
        // 역할이 admin이 아닌 경우 글 작성 버튼 비활성화
        $("#writeForm").hide();  // 글 작성 폼 숨기기
        alert("관리자만 글을 작성할 수 있습니다.");
      }
    }
  } else {
    // 로그인하지 않은 경우: 로그인 페이지로 이동
    loginLink.attr("href", "pages/login.html");
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
    this.index = index || 0;
    this.subject = subjectstr || "";
    this.writer = "admin";
    this.content = contentStr || "";
    this.date = recordDate();
    this.views = 0;
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

// 글 작성 버튼
const submitHandler = async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("로그인 후 글을 작성할 수 있습니다.");
    return;
  }

  // Firebase에서 현재 공지사항 목록 가져오기
  const subject = e.target.subject.value;
  const content = e.target.content.value;

  try {
    // 사용자의 role을 확인하여 admin만 글 작성할 수 있도록
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.role !== 'admin') {
        alert("관리자만 글을 작성할 수 있습니다.");
        return;
      }

      // 기존 공지사항들의 index 값 중 가장 큰 값 찾기
      const noticesRef = ref(database, "notices");
      const snapshotNotices = await get(noticesRef);
      const noticesObj = snapshotNotices.exists() ? snapshotNotices.val() : [];

      let newIndex = 0;
      if (noticesObj) {
        const indexes = Object.values(noticesObj).map(notice => notice.index);
        newIndex = indexes.length > 0 ? Math.max(...indexes) + 1 : 0;
      }

      // 새로운 공지사항 객체 생성
      const instance = new Notice(subject, content, newIndex);

      // Firebase에 새 공지사항 추가
      const newNoticeRef = push(noticesRef); // 고유 키로 데이터 추가
      await set(newNoticeRef, instance);

      // 성공적으로 저장된 경우 상세 페이지로 이동
      location.href = "notice-view.html?key=" + newNoticeRef.key;
    }
  } catch (e) {
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
