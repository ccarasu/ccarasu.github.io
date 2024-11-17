$(function () {
  // 탭 메뉴 클릭 시 클래스 추가 및 제거
  $(".tabmenu > li > a").click(function (event) {
    event.preventDefault(); // 기본 동작 방지
    $(this).parent().addClass("active").siblings().removeClass("active");
  });

  // 당첨 번호 메뉴 클릭 시 클래스 추가 및 제거
  $(".win_num_menu > li > a").click(function (event) {
    event.preventDefault(); // 기본 동작 방지
    $(this).parent().addClass("checked").siblings().removeClass("checked");
  });

  // 햄버거 메뉴 클릭 시 메뉴 열기
  $(".mobile_menu").click(function () {
    $(".nav-menu").fadeToggle(300).toggleClass("open"); // 애니메이션과 함께 메뉴 토글
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  // X 버튼 클릭 시 메뉴 닫기
  $("#closeMenu").click(function () {
    $(".nav-menu").fadeOut(300).removeClass("open"); // 애니메이션과 함께 메뉴 닫기
    $("body").css("overflow", "auto");
  });
});
