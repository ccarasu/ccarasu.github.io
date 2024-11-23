$(function () {
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

  $("#CreateNumber").click(function () {
    // 이전에 생성된 div를 삭제
    const lotto_numbers = document.getElementById('lotto-numbers');
    lotto_numbers.innerHTML = '';

    // 로또 번호를 저장할 배열 생성 (크기 5로 지정)
    const lottoNumber = new Array(5); 
  
    for (let i = 0; i < lottoNumber.length; ) { 
      const number = Math.floor(Math.random() * 45) + 1; // 1부터 45까지의 랜덤 숫자 생성
  
      if (!lottoNumber.includes(number)) { // 생성된 숫자가 중복되지 않으면 추가
        lottoNumber[i] = number; // 해당 인덱스에 숫자 추가
        i++; // 중복되지 않으면 i 증가
      }
    }
  
    // 숫자를 오름차순으로 정렬
    lottoNumber.sort((a, b) => a - b);
  
    // 새로운 div 생성
    const newDiv = document.createElement('div');
    newDiv.className = 'lotto-result'; // 스타일을 위한 클래스 추가

    //각 로또 번호를 <span>태그로 감싸서 추가
    lottoNumber.forEach(function(number) {
      const span = document.createElement('span');  //<span> 태그 생성
      span.textContent = number;  // <span>에 숫자 삽입
      span.classList.add('ball'); // <span>에 'ball' 클래스 추가

      // 번호에 따라 색상 클래스 추가
      if (number >= 1 && number <= 10) {
        span.classList.add('yellow');
      } else if (number >= 11 && number <= 20) {
        span.classList.add('blue');
      } else if (number >= 21 && number <= 30) {
        span.classList.add('red');
      } else if (number >= 31 && number <= 40) {
        span.classList.add('gray');
      } else if (number >= 41 && number <= 45) {
        span.classList.add('green');
      } 
      newDiv.appendChild(span);   // <span>을 newDiv에 추가
    })
  
    // 결과를 표시할 div에 추가
    lotto_numbers.appendChild(newDiv); // 새 div를 'lotto-numbers' div에 추가
  });
});

function getLottoWeekNumber() {
  //오늘 날짜 구하기

  const today = new Date();

  //2002년 12월 7일은 첫 로또 회차 시작일 (첫 로또 회차는 1회차)
  const firstLottoDate = new Date('2002-12-07');

  // 첫 로또 회차 시작일로부터 경과한 주 수를 계산
  const diffTime = today - firstLottoDate;  //밀리초 단위 차이
  const diffDays = diffTime / (1000 * 60 * 60 * 24);  // 일수 차이
  const weeksPassed = Math.floor(diffDays / 7); // 주 수로 변환

  // 첫 회차부터 시작하므로 +1을 더하여 현재 회차 계산
  const currentLottoWeek = weeksPassed + 1;

  //최신 로또 회차 반환
  return currentLottoWeek;
}

console.log(`이번 주 로또 회차는 ${getLottoWeekNumber()}회차입니다.`);


