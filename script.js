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
      }, 3000); // CSS의 animation-duration과 동일하게 설정
  }

  let currentRound = getLottoWeekNumber(); // 시작 회차
  const maxRoundsToDisplay = 5; // 최신 회차 기준 5개 회차까지만 표시

  // 최신 로또 회차 구하는 함수
  function getLottoWeekNumber() {
      const today = new Date();
      const firstLottoDate = new Date('2002-12-07'); // 첫 로또 회차 시작일
      const diffTime = today - firstLottoDate;  // 밀리초 단위 차이
      const diffDays = diffTime / (1000 * 60 * 60 * 24);  // 일수 차이
      const weeksPassed = Math.floor(diffDays / 7); // 주 수로 변환
      
      const todayDay = today.getDay(); // 요일 (0: 일요일 ~ 6: 토요일)
      const todayHours = today.getHours(); // 현재 시간

      // 토요일 오후 8시 기준
      if (todayDay === 6 && todayHours < 20) {
          return weeksPassed; // 이전 주 회차 반환
      }
      return weeksPassed + 1; // 최신 회차 반환
  }

  // 로또 데이터를 가져오는 함수
  async function fetchLottoData(round) {
      const url = `https://lotto-uptqg4je2a-uc.a.run.app/?drwNo=${round}`;
      console.log("API 호출 URL:", url);
      try {
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.returnValue === "success") {
              // 회차 정보
              document.querySelectorAll(".round").forEach(element => {
                  element.innerText = `${data.drwNo}회 당첨번호`;
              });
      
              // 번호들
              const lottoNumbers = [
                  data.drwtNo1, data.drwtNo2, data.drwtNo3, 
                  data.drwtNo4, data.drwtNo5, data.drwtNo6
              ];
      
              // 색상 클래스를 추가하는 함수
              function addColorClass(number, span) {
                  if (number >= 1 && number <= 10) {
                      span.classList.add('yellow'); // 1~10번은 yellow 클래스
                  } else if (number >= 11 && number <= 20) {
                      span.classList.add('blue'); // 11~20번은 blue 클래스
                  } else if (number >= 21 && number <= 30) {
                      span.classList.add('red'); // 21~30번은 red 클래스
                  } else if (number >= 31 && number <= 40) {
                      span.classList.add('gray'); // 31~40번은 gray 클래스
                  } else if (number >= 41 && number <= 45) {
                      span.classList.add('green'); // 41~45번은 green 클래스
                  }
              }
      
              // 각 로또 번호에 색상 클래스 추가
              document.querySelectorAll(".ball1").forEach(element => {
                  const number = data.drwtNo1;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
              document.querySelectorAll(".ball2").forEach(element => {
                  const number = data.drwtNo2;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
              document.querySelectorAll(".ball3").forEach(element => {
                  const number = data.drwtNo3;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
              document.querySelectorAll(".ball4").forEach(element => {
                  const number = data.drwtNo4;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
              document.querySelectorAll(".ball5").forEach(element => {
                  const number = data.drwtNo5;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
              document.querySelectorAll(".ball6").forEach(element => {
                  const number = data.drwtNo6;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
      
              // 보너스 번호에 색상 클래스 추가
              document.querySelectorAll(".bonus").forEach(element => {
                  const number = data.bnusNo;
                  element.innerText = number;
                  addColorClass(number, element); // 색상 클래스 추가
              });
          }
      
          else {
              alert("유효하지 않은 회차입니다.");
          }
      } catch (error) {
          console.error("API 호출 중 오류 발생:", error);
          alert("데이터를 불러올 수 없습니다.");
      }
  }

  // 이전 회차로 이동
  document.querySelectorAll(".prev").forEach(button => {
      button.addEventListener("click", () => {
          if (currentRound > getLottoWeekNumber() - maxRoundsToDisplay) {
              currentRound--;
              fetchLottoData(currentRound);
          } else {
              alert("첫 회차입니다.");
          }
      });
  });

  // 다음 회차로 이동
  document.querySelectorAll(".next").forEach(button => {
      button.addEventListener("click", () => {
          const latestRound = getLottoWeekNumber();
          if (currentRound < latestRound) {
              currentRound++;
              fetchLottoData(currentRound);
          } else {
              alert("최신 회차입니다.");
          }
      });
  });

  // 초기 데이터 로드
  fetchLottoData(currentRound);
});
