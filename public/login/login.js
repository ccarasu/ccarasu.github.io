$(function () {
    // 로그인 버튼 클릭 이벤트
    $("button[type='submit']").click(function (event) {
        event.preventDefault(); // 폼의 기본 동작(페이지 리로드)을 막음

        // 입력된 아이디와 비밀번호 값 가져오기
        const username = $("#username").val().trim(); // 아이디 입력값
        const password = $("#password").val().trim(); // 비밀번호 입력값

        // 입력값 검증
        if (!username) {
            alert("아이디를 입력하세요."); // 아이디 입력값이 없을 때 경고 메시지
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요."); // 비밀번호 입력값이 없을 때 경고 메시지
            return;
        }

        // 로그인 성공 또는 실패 처리 (예제에서는 간단히 처리)
        if (username === "admin" && password === "1234") {
            alert("로그인 성공! 환영합니다."); // 로그인 성공 메시지
            window.location.href = "/public/index.html"; // 메인 페이지로 이동
        } else {
            alert("아이디 또는 비밀번호가 잘못되었습니다."); // 로그인 실패 메시지
        }
    });

    // 회원가입 버튼 클릭 이벤트
    $(".signup-button").click(function () {
        alert("회원가입 페이지로 이동합니다."); // 회원가입 버튼 클릭 시 메시지
        window.location.href = "join.html"; // 회원가입 페이지로 이동
    });

    // 뒤로가기 버튼 클릭 이벤트
    $(".back-button").click(function () {
        history.back(); // 이전 페이지로 이동
    });
});