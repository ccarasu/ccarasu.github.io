// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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
const db = getDatabase(app);
const auth = getAuth(app);


$(function () {
    // 회원가입 버튼 클릭 이벤트
    $(".signup-button").click(async function (event) {
        event.preventDefault(); // 기본 동작 방지

        // 입력 값 가져오기
        const username = $("#username").val().trim();
        const email = $("#email").val().trim();
        const password = $("#password").val().trim();
        const passwordCheck = $("#password-check").val().trim();

        // 입력 검증
        if (!username) {
            alert("아이디를 입력하세요.");
            return;
        }
        if (!/^[a-zA-Z0-9]{1,20}$/.test(username)) {
            alert("아이디는 20자 이하 알파벳과 숫자만 가능합니다.");
            return;
        }

        if (!email) {
            alert("이메일 주소를 입력하세요.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("유효한 이메일 주소를 입력하세요.");
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요.");
            return;
        }
        if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,20}$/.test(password)) {
            alert("비밀번호는 문자, 숫자, 특수문자를 포함하여 8~20자 사이여야 합니다.");
            return;
        }

        if (!passwordCheck) {
            alert("비밀번호 확인란을 입력하세요.");
            return;
        }
        if (password !== passwordCheck) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        // Firebase Authentication을 이용한 회원가입
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firebase 실시간 데이터베이스에 사용자 정보 저장
            await set(ref(db, `users/${user.uid}`), {
                username: username,
                email: email,
                createdAt: new Date().toISOString(),
            });

            alert("회원가입이 완료되었습니다!");
            window.location.href = "/public/index.html"; // 메인 페이지로 이동
        } catch (error) {
            // Firebase 에러 처리
            console.error(error.message);
            alert("회원가입 실패: " + error.message);
        }
    });

    // 뒤로가기 버튼 클릭 이벤트
    $(".back-button").click(function () {
        history.back(); // 이전 페이지로 이동
    });

    // 이메일 입력 시 실시간 검증 (선택사항)
    $("#email").on("input", function () {
        const email = $(this).val().trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $(this).css("border", "1px solid red"); // 잘못된 입력 시 경고 테두리
        } else {
            $(this).css("border", "1px solid #ccc"); // 올바른 입력 시 원래 상태로 복구
        }
    });

    // 비밀번호 확인 실시간 검증 (선택사항)
    $("#password-check").on("input", function () {
        const password = $("#password").val().trim();
        const passwordCheck = $(this).val().trim();
        if (password !== passwordCheck) {
            $(this).css("border", "1px solid red"); // 불일치 시 경고 테두리
        } else {
            $(this).css("border", "1px solid #ccc"); // 일치 시 원래 상태로 복구
        }
    });
});
