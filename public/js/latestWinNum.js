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

  const maxRoundsToDisplay = 5; // 최신 회차 기준 5개 표시
  const $latestLotto = $("#latestLotto"); // 데이터가 들어갈 컨테이너

  // 최신 로또 회차 구하는 함수
  function getLottoWeekNumber() {
    const today = new Date();
    const firstLottoDate = new Date("2002-12-07");
    const diffTime = today - firstLottoDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const weeksPassed = Math.floor(diffDays / 7);

    const todayDay = today.getDay();
    const todayHours = today.getHours();

    if (todayDay === 6 && todayHours < 21) {
      return weeksPassed;
    }
    return weeksPassed + 1;
  }

  // 로또 데이터를 가져오는 함수
  async function fetchLottoData(round, index) {
    const url = `https://lotto-uptqg4je2a-uc.a.run.app/?drwNo=${round}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.returnValue === "success") {
        renderLottoData(data, index); // 데이터를 화면에 렌더링
      } else {
        console.warn(`유효하지 않은 회차: ${round}`);
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  }

 // 데이터를 화면에 렌더링하는 함수
function renderLottoData(data, index) {
  // 회차 번호를 감쌀 div 추가
  const $roundDiv = $("<div>").addClass(`round${index + 1}`);
  
  // 회차 번호를 별도의 div로 감싸기
  const $roundNumberDiv = $("<div>").addClass("round-number").text(`${data.drwNo}회 당첨번호`);
  
  // 공들의 컨테이너 생성
  const $ballContainer = $("<div>").addClass("ball-container");

  const numbers = [
    data.drwtNo1,
    data.drwtNo2,
    data.drwtNo3,
    data.drwtNo4,
    data.drwtNo5,
    data.drwtNo6,
  ];

  numbers.forEach((number) => {
    const $ball = $("<span>").addClass("ball").text(number);
    addColorClass(number, $ball); // 색상 적용
    $ballContainer.append($ball);
  });

  // 보너스 번호 추가
  const $bonusBall = $("<span>").addClass("ball bonus").text(data.bnusNo);
  addColorClass(data.bnusNo, $bonusBall); // 보너스 번호에도 색상 적용
  $ballContainer.append($bonusBall);

  // 회차 번호 div와 ball-container를 하나의 div에 추가
  $roundDiv.append($roundNumberDiv).append($ballContainer);

  // 최신 로또 당첨번호를 '#latestLotto'에 추가
  $latestLotto.append($roundDiv);
}


  // 색상 클래스를 추가하는 함수
  function addColorClass(number, $element) {
    $element.removeClass("yellow blue red gray green"); // 기존 클래스 제거
    if (number >= 1 && number <= 10) {
      $element.addClass("yellow");
    } else if (number >= 11 && number <= 20) {
      $element.addClass("blue");
    } else if (number >= 21 && number <= 30) {
      $element.addClass("red");
    } else if (number >= 31 && number <= 40) {
      $element.addClass("gray");
    } else if (number >= 41 && number <= 45) {
      $element.addClass("green");
    }
  }

  // 최신 로또 회차 5개 로드
  async function loadLatestRounds() {
    const latestRound = getLottoWeekNumber();
    $latestLotto.empty(); // 기존 데이터를 비움
    for (let i = 0; i < maxRoundsToDisplay; i++) {
      await fetchLottoData(latestRound - i, i);
    }
  }

  // 초기화
  loadLatestRounds();

  // 검색 기능
  $("#search-btn").click(async function () {
    const round = $("#WinNumList").val();
    if (!round || isNaN(round) || round <= 0) {
      alert("올바른 로또 회차를 입력하세요.");
      return;
    }
    $latestLotto.empty(); // 기존 데이터를 비우고
    await fetchLottoData(round, 0); // 검색 회차 데이터만 표시
  });
});