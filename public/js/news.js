import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
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
  
  $(".back-button").click(function () {
    history.back();
  });
});



