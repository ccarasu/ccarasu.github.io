import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push, query, orderByChild, limitToLast, limitToFirst, startAfter, endBefore, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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

let lastVisibleKey = null; // 현재 마지막 데이터 키
let firstVisibleKey = null; // 현재 첫 데이터 키
let pageNumber = 1;
const maxPage = 50;
let isLoading = false; // 데이터 로드 상태 플래그

$(function () {
  // 햄버거 메뉴 토글
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open");
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open");
    $("body").css("overflow", "auto");
  });

  // 로또 번호 생성
  $("#CreateNumber").click(function () {
    const lotto_numbers = document.getElementById('lotto-numbers');
    lotto_numbers.innerHTML = '';

    const lottoNumberSet = new Set();
    while (lottoNumberSet.size < 6) {
      lottoNumberSet.add(Math.floor(Math.random() * 45) + 1);
    }
    const lottoNumber = Array.from(lottoNumberSet).sort((a, b) => a - b);

    const newDiv = document.createElement('div');
    newDiv.className = 'lotto-result';

    lottoNumber.forEach(number => {
      const span = document.createElement('span');
      span.textContent = number;
      span.classList.add('ball');
      span.classList.add(getBallColor(number));
      newDiv.appendChild(span);
    });

    lotto_numbers.appendChild(newDiv);

    const latestDrawNumber = getLottoWeekNumber();
    const drawInfoDiv = document.getElementById('lotto-draw-info');
    drawInfoDiv.textContent = `${latestDrawNumber}회 로또번호 생성 완료`;

    const generatedTime = new Date();
    const year = generatedTime.getFullYear();
    const month = (generatedTime.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = generatedTime.getDate().toString().padStart(2, '0');
    const hours = generatedTime.getHours().toString().padStart(2, '0');
    const minutes = generatedTime.getMinutes().toString().padStart(2, '0');
    const seconds = generatedTime.getSeconds().toString().padStart(2, '0');

    // 원하는 형식으로 조합: YYYYMMDDHHMMSS
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const timeNow = document.getElementById('lotto-time');
    timeNow.innerHTML = `${formattedTime}`;

    const drawData = {
      drawNumber: latestDrawNumber,
      numbers: lottoNumber,
      createdAt: formattedTime,
    };

    // 새로운 데이터가 Firebase에 푸시
    const drawsRef = ref(database, "lottoDraws");
    push(drawsRef, drawData)
      .then(() => console.log("데이터 저장 성공:", drawData))
      .catch(error => console.error("데이터 저장 실패: ", error));
  });

  // 초기 데이터 로드
  loadInitialDraws();

  // 실시간 데이터 반영 (Firebase 데이터가 변경될 때마다 실행)
  const drawsRef = ref(database, "lottoDraws");
  onValue(drawsRef, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      displayPreviousDraws(drawsArray.reverse());
    }
  });

  // 다음 버튼
  $("#nextPage").click(function () {
    if (isLoading) return;
    loadNextDraws();
  });

  // 이전 버튼
  $("#prevPage").click(function () {
    if (isLoading) return;
    loadPreviousDraws();
  });
});

// 실시간 데이터 반영: 데이터베이스에 변화가 있을 때마다 데이터 로드
function loadInitialDraws() {
  const initialQuery = query(ref(database, "lottoDraws"), orderByChild("createdAt"), limitToLast(5));
  onValue(initialQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      firstVisibleKey = drawsArray[0].key; // 첫 번째 데이터 키 저장
      lastVisibleKey = drawsArray[drawsArray.length - 1].key; // 마지막 데이터 키 저장
      displayPreviousDraws(drawsArray.reverse());
      checkPrevButtonVisibility(drawsArray.reverse());
      updatePageNumber();
    }
  }, { onlyOnce: true });
}

// 다음 데이터 로드 (페이지네이션)
function loadNextDraws() {
  if (!lastVisibleKey) return; // 더 이상 로드할 데이터가 없으면 종료
  isLoading = true;
  $("#loadingMessage").show();
  pageNumber++;

  const nextQuery = query(ref(database, "lottoDraws"), orderByChild("createdAt"), startAfter(lastVisibleKey), limitToFirst(5));
  onValue(nextQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        firstVisibleKey = drawsArray[0].key; // 첫 번째 데이터 키 갱신
        lastVisibleKey = drawsArray[drawsArray.length - 1].key; // 마지막 데이터 키 갱신
        displayPreviousDraws(drawsArray.reverse());
      } else {
        alert("더 이상 데이터가 없습니다.");
      }
    } else {
      alert("데이터 로드 실패!");
    }
    isLoading = false;
    $("#loadingMessage").hide();
  }, (error) => {
    alert("데이터 로드 중 에러 발생: " + error.message);
    isLoading = false;
    $("#loadingMessage").hide();

    updatePageNumber();
  });
}

// 이전 데이터 로드 (페이지네이션)
function loadPreviousDraws() {
  if (!firstVisibleKey) return; // 더 이상 로드할 데이터가 없으면 종료
  isLoading = true;
  $("#loadingMessage").show();
  pageNumber--;

  const prevQuery = query(ref(database, "lottoDraws"), orderByChild("createdAt"), endBefore(firstVisibleKey), limitToLast(5));
  onValue(prevQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        firstVisibleKey = drawsArray[0].key; // 첫 번째 데이터 키 갱신
        lastVisibleKey = drawsArray[drawsArray.length - 1].key; // 마지막 데이터 키 갱신
        displayPreviousDraws(drawsArray.reverse());
      } else {
        alert("더 이상 이전 데이터가 없습니다.");
      }
    } else {
      alert("데이터 로드 실패!");
    }
    isLoading = false;
    $("#loadingMessage").hide();
  }, (error) => {
    alert("데이터 로드 중 에러 발생: " + error.message);
    isLoading = false;
    $("#loadingMessage").hide();

    updatePageNumber();
  });
}

// 데이터 출력 함수
function displayPreviousDraws(drawsArray) {
  const lottoListDiv = document.getElementById("lotto-list");
  lottoListDiv.innerHTML = ''; // 이전 데이터를 초기화하고 새 데이터를 추가

  const limitedDraws = drawsArray.slice(0,5);

  limitedDraws.forEach(draw => {
    const drawDiv = document.createElement("div");
    drawDiv.className = "lotto-draw";

    const drawNumber = document.createElement("div");
    drawNumber.textContent = `${draw.drawNumber}회 로또 생성 번호`;
    drawNumber.className = 'Previous-draw-info';

    const numbersDiv = document.createElement("div");
    numbersDiv.className = 'Previous-list';

    draw.numbers.forEach(number => {
      const span = document.createElement('span');
      span.textContent = number;
      span.classList.add('ball');
      span.classList.add(getBallColor(number));
      numbersDiv.appendChild(span);
    });

    const createdAt = document.createElement("div");
    createdAt.textContent = `${draw.createdAt}`;
    createdAt.className = 'previousTime';

    drawDiv.appendChild(drawNumber);
    drawDiv.appendChild(numbersDiv);
    drawDiv.appendChild(createdAt);

    lottoListDiv.appendChild(drawDiv);
  });

  checkPrevButtonVisibility(drawsArray);
  updatePageNumber();
}

// 볼 색상 계산
function getBallColor(number) {
  if (number >= 1 && number <= 10) return 'yellow';
  if (number >= 11 && number <= 20) return 'blue';
  if (number >= 21 && number <= 30) return 'red';
  if (number >= 31 && number <= 40) return 'gray';
  if (number >= 41 && number <= 45) return 'green';
}

function checkPrevButtonVisibility(drawsCount) {
  if (drawsCount < 5) {
    $("#prevPage").hide();
  } else {
    $("#prevPage").show();
  }
}

function updatePageNumber() {
  if (pageNumber>maxPage)
  {
    alert("더 이상 페이지를 넘길 수 없습니다.");
  }
  document.getElementById("pageNumber").textContent = `${pageNumber}/${maxPage}`;
}
function getLottoWeekNumber() {
  const today = new Date(); 

  const firstLottoDate = new Date('2002-12-07'); // 첫 로또 추첨일, 한국 시간
  const diffTime = today - firstLottoDate; // 밀리초 단위 시간 차이
  const diffDays = diffTime / (1000 * 60 * 60 * 24); // 일 단위 변환
  const weeksPassed = Math.floor(diffDays / 7); // 주 단위 계산

  const todayDay = today.getDay(); // 요일(0: 일요일, 6: 토요일)
  const todayHours = today.getHours(); // 시간 (24시간 형식)

  if (todayDay === 6 && todayHours < 20) {
    return weeksPassed; // 토요일 오후 8시 이전은
  }
  return weeksPassed + 1;
}
