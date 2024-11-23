$(function () {
  let slideIndex = 1; // 슬라이드 인덱스 초기화

  // 모든 슬라이드 숨기기
  $(".win_num_menu .slide-container .slide").hide();
  
  // 첫 번째 슬라이드와 컨테이너 초기화
  $(".win_num_menu > li:first-child .slide-container").show();
  $(".win_num_menu > li:first-child .slide-container .slide:first").show();

  // 탭 메뉴 클릭 시 해당 탭에 'active' 클래스 추가하고 다른 탭의 'active' 클래스 제거
  $(".tabmenu > li > a").click(function (event) {
    event.preventDefault(); // 기본 링크 클릭 동작(페이지 이동 등)을 방지
    $(this).parent().addClass("active") // 클릭한 항목의 부모(li)에 'active' 클래스를 추가
           .siblings().removeClass("active"); // 형제 요소들의 'active' 클래스는 제거
  });

  // 당첨 번호 메뉴 클릭 시 해당 항목에 'checked' 클래스 추가하고 다른 항목의 'checked' 클래스 제거
  $(".win_num_menu > li > a").click(function (event) {
    event.preventDefault(); // 기본 링크 클릭 동작(페이지 이동 등)을 방지
    $(this).parent().addClass("checked") // 클릭한 항목의 부모(li)에 'checked' 클래스를 추가
           .siblings().removeClass("checked"); // 형제 요소들의 'checked' 클래스는 제거
    
    // 슬라이드 초기화
    const targetContainer = $(this).siblings(".slide-container");
    $(".slide-container").hide(); // 다른 슬라이드 컨테이너 숨기기
    targetContainer.show(); // 선택된 슬라이드 컨테이너 표시

    slideIndex = 1; // 슬라이드 인덱스 초기화
    showSlides(slideIndex, targetContainer); // 첫 번째 슬라이드로 초기화
  });

  // prev/next 버튼 클릭 이벤트 처리
  $(".win_num_menu").on("click", ".prev", function () {
    const container = $(this).closest(".slide-container");
    plusSlides(-1, container); // 이전 슬라이드
  });

  $(".win_num_menu").on("click", ".next", function () {
    const container = $(this).closest(".slide-container");
    plusSlides(1, container); // 다음 슬라이드
  });

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

  // 슬라이드 전환 함수
  function plusSlides(n, container) {
    slideIndex += n; // 슬라이드 인덱스를 변경
    showSlides(slideIndex, container); // 새 슬라이드 표시
  }

  // 슬라이드 표시 함수
  function showSlides(n, container) {
    const slides = container.find(".slide"); // ".slide" 클래스를 가진 요소 찾기
    if (n > slides.length) slideIndex = 1; // 마지막 슬라이드 다음이면 첫 번째 슬라이드로
    if (n < 1) slideIndex = slides.length; // 첫 번째 슬라이드 이전이면 마지막 슬라이드로

    slides.hide(); // 모든 슬라이드 숨기기
    slides.eq(slideIndex - 1).show(); // 현재 슬라이드만 표시
    
    // 슬라이드 전환 시 fade 효과 추가
    $(slides[slideIndex - 1]).addClass("fade");
    setTimeout(() => {
      $(slides[slideIndex - 1]).removeClass("fade");
    }, 1500); // CSS의 animation-duration과 동일하게 설정
  }
});
