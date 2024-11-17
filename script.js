$(function () {
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
  });

  // 햄버거 메뉴 클릭 시 메뉴 열기/닫기
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open"); // nav-menu에 'open' 클래스를 토글하여 메뉴 열고 닫기
    // 메뉴가 열리면 body의 overflow를 'hidden'으로 설정해 스크롤이 생기지 않도록 함
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  // X 버튼 클릭 시 메뉴 닫기
  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open"); // nav-menu에서 'open' 클래스를 제거하여 메뉴 닫기
    $("body").css("overflow", "auto"); // 메뉴가 닫히면 body의 overflow를 'auto'로 복원하여 스크롤이 가능하도록 함
  });
});

