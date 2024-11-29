import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push, onValue,query, limitToFirst, startAfter } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Firebase 초기화
const firebaseConfig = {
  apiKey: "AIzaSyDwZIP7CNex9zvLckwM5xCf0iafsYfAQcE",
  authDomain: "basicweb-6group.firebaseapp.com",
  databaseURL: "https://basicweb-6group-default-rtdb.firebaseio.com",
  projectId: "basicweb-6group",
  storageBucket: "basicweb-6group.firebasestorage.app",
  messagingSenderId: "454084926465",
  appId: "1:454084926465:web:5c6c52bbe7c837632cf400",
  measurementId: "G-FHTJY0MMFG"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let lastKey = null;
let isLoading = false;
let pageCount = 1;
const maxPages = 50;

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

  $(function () {
    // "다음 페이지" 버튼 클릭 시 새로운 페이지 로드
    $("#nextPage").click(function () {
      if (!isLoading) {
        loadMoreDraws();
      }
    });
  
    // 처음 5개의 로또 결과를 로드
    loadMoreDraws();
  });
  // 로또 데이터를 페이지 단위로 가져오는 함수
  function loadMoreDraws() {
    isLoading = true;  // 데이터 로딩 중 설정

    let drawsQuery = ref(database, 'lottoDraws');
    
    if (lastKey) {
      // lastKey 이후부터 10개 데이터 가져오기
      drawsQuery = query(drawsQuery, startAfter(lastKey), limitToFirst(10));
    } else {
      // 처음 5개 데이터 가져오기
      drawsQuery = query(drawsQuery, limitToFirst(5));
    }

    onValue(drawsQuery, (snapshot) => {
      const drawsData = snapshot.val();
      if (drawsData) {
        // 마지막 데이터를 추적하기 위해 마지막 key 저장
        const drawsArray = Object.values(drawsData);
        lastKey = drawsArray[drawsArray.length - 1].drawNumber;  // 마지막으로 로드된 데이터의 키를 lastKey로 설정

        // 화면에 데이터 표시
        displayPreviousDraws(drawsData);

        pageCount++;
      }

      isLoading = false;  // 데이터 로딩 종료
    });
  }
  $("#CreateNumber").click(function () {
    // 이전에 생성된 div를 삭제
    const lotto_numbers = document.getElementById('lotto-numbers');
    lotto_numbers.innerHTML = '';

    // 로또 번호를 저장할 배열 생성 (크기 6로 지정)
    const lottoNumber = new Array(6); 
  
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

    // 최신 회차 계산 (단순화된 예시)
    const latestDrawNumber = getLottoWeekNumber(); // 최신 회차를 계산하는 함수 호출
    const drawInfoDiv = document.getElementById('lotto-draw-info');
    drawInfoDiv.textContent = `${latestDrawNumber}회 로또번호 생성 완료`;

    // 생성된 시간 표시
    const generatedTime = new Date();
    const year = generatedTime.getFullYear(); //년도
    const month = (generatedTime.getMonth() + 1).toString().padStart(2, '0'); //월 (0부터 시작하므로 +1)
    const day = generatedTime.getDate().toString().padStart(2, '0'); //일
    const hours = generatedTime.getHours().toString().padStart(2, '0'); // 시간
    const minutes = generatedTime.getMinutes().toString().padStart(2, '0'); // 분
    const seconds = generatedTime.getSeconds().toString().padStart(2, '0'); // 초

    const formattedTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;

    const timeNow = document.getElementById('lotto-time');
    timeNow.innerHTML = `${formattedTime}`;

    // **Realtime Database에 데이터 저장** 
    const drawData = {
      drawNumber: latestDrawNumber,
      numbers: lottoNumber,
      createdAt:  `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`, // 생성된 시간
    };
    const drawsRef = ref(database, "lottoDraws");
    push(drawsRef, drawData)
      .then(() => {
        console.log("데이터 저장 성공:",drawData);
      })
      .catch((error) => {
        console.error("데이터 저장 실패: ", error);
      });
  });

  // Firebase Realtime Database에서 실시간 데이터 가져오기
  const drawsRef = ref(database, "lottoDraws");

  onValue(drawsRef, (snapshot) => {
    const drawsData = snapshot.val(); //데이터 가져오기

    if (drawsData) {
      //데이터가 있을 경우 이전 로또 결과 표시
      displayPreviousDraws(drawsData);
    } else {
      console.log("No data available");
    }
  });

  // 이전 로또 결과를 웹페이지에 표시하는 함수
function displayPreviousDraws(drawsData) {
  const lottoListDiv = document.getElementById("lotto-list"); // 'lotto-list' 요소 찾기

  // 기존 목록을 초기화하여 중복 방지
  lottoListDiv.innerHTML = ''; // 기존 목록 지우기

  // 데이터의 각 로또 결과를 HTML로 표시
  for (let drawId in drawsData) {
    const draw = drawsData[drawId];  // 각 회차 데이터
    const drawDiv = document.createElement("div");
    drawDiv.className = "lotto-draw"; // 각 로또 회차를 감쌀 div

    // 각 회차 데이터 표시
    const drawNumber = document.createElement("div");
    drawNumber.textContent = `${draw.drawNumber}회 로또 생성 번호`;
    drawNumber.className = 'Previous-draw-info';
    
    // 번호들을 담을 div 생성
    const numbersDiv = document.createElement("div");  // 이 부분이 정의되어야 함
    numbersDiv.className = 'Previous-list';

    // 각 로또 번호를 <span>태그로 감싸서 추가
    draw.numbers.forEach(function(number) {  // draw.numbers로 변경
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

      numbersDiv.appendChild(span);  // 각 번호를 numbersDiv에 추가
    });

    const createdAt = document.createElement("div");
    createdAt.textContent = `${draw.createdAt}`;
    createdAt.className = 'previousTime';

    // 각 회차 div에 내용 추가
    drawDiv.appendChild(drawNumber);
    drawDiv.appendChild(numbersDiv);  // 번호들을 담은 div 추가
    drawDiv.appendChild(createdAt);
    
    // lotto-list에 추가 (기존 내용에 덧붙여 추가)
    lottoListDiv.appendChild(drawDiv);
  }
}
});

//최신 로또 회차 구하는 함수
function getLottoWeekNumber() {
  //오늘 날짜 구하기

  const today = new Date();

  //2002년 12월 7일은 첫 로또 회차 시작일 (첫 로또 회차는 1회차)
  const firstLottoDate = new Date('2002-12-07');

  // 첫 로또 회차 시작일로부터 경과한 주 수를 계산
  const diffTime = today - firstLottoDate;  //밀리초 단위 차이
  const diffDays = diffTime / (1000 * 60 * 60 * 24);  // 일수 차이
  const weeksPassed = Math.floor(diffDays / 7); // 주 수로 변환
  
  // 토요일 오후 8시 기준
  const todayDay = today.getDay(); // 요일 (0: 일요일 ~ 6: 토요일)
  const todayHours = today.getHours(); // 현재 시간

  // 토요일이지만 오후 8시 전이라면 최신 회차는 아직 갱신되지 않음
  if (todayDay === 6 && todayHours < 20) {
      return weeksPassed; // 이전 주 회차 반환
  }

  return weeksPassed + 1; // 최신 회차 반환
}
