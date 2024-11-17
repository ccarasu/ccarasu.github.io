jQuery(document).ready(function () {
  // 탭 메뉴 클릭 시 클래스 추가 및 제거
  $(".tabmenu > li > a").click(function () {
    $(this).parent().addClass("active").siblings().removeClass("active");
    return false;
  });

  // 당첨 번호 메뉴 클릭 시 클래스 추가 및 제거
  $(".win_num_menu > li > a").click(function () {
    $(this).parent().addClass("checked").siblings().removeClass("checked");
    return false;
  });

  // 로또 데이터 슬라이드 기능
  const slider = $(".lotto");

  async function fetchLottoData() {
    const latestDraw = 903; // 최신 회차 번호를 알고 있다면 여기서 변경.
    for (let i = latestDraw; i > latestDraw - 5; i--) {
      // 최근 5회차의 데이터를 슬라이드로 추가
      await addSlide(i);
    }
    initializeSlider();
  }
})
document.querySelector('.mobile_menu'),addEventListener('click', function() {
  const navMenu = document.querySelector('.nav-menu');
  navMenu.style.display = navMenu.style.display === 'none' ? 'flex' : 'none' ;
});
// 햄버거 메뉴 토글 기능 추가
const mobileMenu = document.getElementById('mobileMenu');
const navMenu = document.getElementById('navMenu');
const closeMenu = document.getElementById('closeMenu')

//햄버거 메뉴 클릭시 메뉴 열기
mobileMenu.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto'; //스크롤 차단
});

//X 버튼 클릭시 메뉴 닫기
closeMenu.addEventListener('click', ()=> {
  navMenu.classList.remove('open');
  document.body.style.overflow = 'auto'; //배경 스크롤 복원
})
