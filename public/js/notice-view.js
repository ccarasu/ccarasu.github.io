import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
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

// URL에서 index 값만 추출
const urlParams = new URLSearchParams(location.search);
const index = parseInt(urlParams.get('index'), 10);  // ?index=0

// index 값이 숫자가 아닌 경우 처리
if (!isNaN(index)) {
  // 모든 공지사항을 Firebase에서 가져오기
  const noticesRef = ref(database, 'notices');
  
  get(noticesRef).then((snapshot) => {
    if (snapshot.exists()) {
      const noticesObj = snapshot.val();
      let foundNotice = null;

      // 공지사항 목록에서 index에 해당하는 공지 찾기
      for (const key in noticesObj) {
        if (noticesObj[key].index === index) {
          foundNotice = noticesObj[key];
          break;
        }
      }

      if (foundNotice) {
        // 공지사항을 찾은 경우
        console.log("찾은 공지사항:", foundNotice);

        // 각 div에 값을 넣어주기
        document.querySelector("#subject").innerText = foundNotice.subject;  // 제목
        document.querySelector("#writer").innerText = "작성자: " + foundNotice.writer;  // 작성자
        document.querySelector("#date").innerText = "작성일: " + foundNotice.date;  // 작성일
        document.querySelector("#content").innerHTML = foundNotice.content;  // 내용

      } else {
        console.log("해당 index에 대한 공지를 찾을 수 없습니다.");
      }
    } else {
      console.log("공지 데이터가 존재하지 않습니다.");
    }
  }).catch((error) => {
    console.error("데이터 로드 실패:", error);
  });
} else {
  console.error("유효한 index 값이 URL에 없습니다.");
}
