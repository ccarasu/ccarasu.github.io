// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDwZIP7CNex9zvLckwM5xCf0iafsYfAQcE",
    authDomain: "basicweb-6group.firebaseapp.com",
    databaseURL: "https://basicweb-6group-default-rtdb.firebaseio.com",
    projectId: "basicweb-6group",
    storageBucket: "basicweb-6group.appspot.com",
    messagingSenderId: "454084926465",
    appId: "1:454084926465:web:5c6c52bbe7c837632cf400",
    measurementId: "G-FHTJY0MMFG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

$(function () {
    // 햄버거 메뉴 클릭 시 메뉴 열기/닫기
    $(".mobile_menu").click(function () {
        $(".nav-menu").toggleClass("open");
        $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
    });

    // X 버튼 클릭 시 메뉴 닫기
    $("#closeMenu").click(function () {
        $(".nav-menu").removeClass("open");
        $("body").css("overflow", "auto");
    });

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

    // 로그인 버튼 클릭 이벤트
    $("button[type='submit']").click(async function (event) {
        event.preventDefault();

        // 입력된 이메일과 비밀번호 값 가져오기
        const email = $("#email").val().trim(); // 이메일 입력값
        const password = $("#password").val().trim(); // 비밀번호 입력값

        // 입력값 검증
        if (!email) {
            alert("이메일을 입력하세요.");
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요.");
            return;
        }

        // Firebase Authentication 로그인 처리
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 로그인 성공
            alert("로그인 성공! 환영합니다.");
            window.location.href = "/public/index.html"; // 메인 페이지로 이동
        } catch (error) {
            // Firebase 에러 처리
            console.error(error.message);
            alert("로그인 실패: " + error.message);
        }
    });

    // 회원가입 버튼 클릭 이벤트
    $(".signup-button").click(function () {
        alert("회원가입 페이지로 이동합니다.");
        window.location.href = "join.html"; // 회원가입 페이지로 이동
    });

    // 뒤로가기 버튼 클릭 이벤트
    $(".back-button").click(function () {
        history.back();
    });
});
