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

let lastVisibleKey = null;  // 마지막 데이터 키
let firstVisibleKey = null; // 첫 번째 데이터 키
let pageNumber = 1;
const maxPage = 50;
let isLoading = false;

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

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const timeNow = document.getElementById('lotto-time');
    timeNow.innerHTML = `${formattedTime}`;

    const drawData = {
      drawNumber: latestDrawNumber,
      numbers: lottoNumber,
      createdAt: formattedTime,
    };

    const drawsRef = ref(database, "lottoDraws");
    push(drawsRef, drawData)
      .then(() => console.log("데이터 저장 성공:", drawData))
      .catch(error => console.error("데이터 저장 실패: ", error));
  });

  // 초기 데이터 로드
  loadInitialDraws();

  // 실시간 데이터 반영
  const drawsRef = ref(database, "lottoDraws");
  onValue(drawsRef, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      displayPreviousDraws(drawsArray);
    }
  });

  // 다음 버튼
  $("#nextPage").click(function () {
    if (!isLoading){
      pageNumber++;
      loadNextDraws();
    }
    
  });

  // 이전 버튼
  $("#prevPage").click(function () {
    if (!isLoading && pageNumber) {
      pageNumber--;
      loadPreviousDraws();
    }
  });
});

// 초기 데이터 로드
function loadInitialDraws() {
  const initialQuery = query(
    ref(database, "lottoDraws"), 
    orderByChild("createdAt"), 
    limitToLast(5)
  );
  
  onValue(initialQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      drawsArray.reverse(); 
      firstVisibleKey = drawsArray[0].key;
      lastVisibleKey = drawsArray[drawsArray.length - 1].key;
      displayPreviousDraws(drawsArray);
      pageNumber = 1; 
      checkPrevButtonVisibility();
    }
  }, { onlyOnce: true });
}

function loadNextDraws() {
  if (!lastVisibleKey || isLoading) return;
  isLoading = true;

  const nextQuery = query(
    ref(database, "lottoDraws"),
    orderByChild("createdAt"),
    startAfter(lastVisibleKey), // 현재 마지막 데이터 이후의 데이터를 가져옴
    limitToFirst(5) // 다음 5개
  );

  onValue(nextQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        firstVisibleKey = drawsArray[0].key;
        lastVisibleKey = drawsArray[drawsArray.length - 1].key;
        displayPreviousDraws(drawsArray);
        pageNumber++;
        updatePageNumber();
        checkPrevButtonVisibility();
      } else {
        alert("더 이상 데이터가 없습니다.");
      }
    }
    isLoading = false;
  }, { onlyOnce: true });
}

function loadPreviousDraws() {
  if (!lastVisibleKey || isLoading || pageNumber === 1) return;
  isLoading = true;

  const prevQuery = query(
    ref(database, "lottoDraws"),
    orderByChild("createdAt"),
    endBefore(lastVisibleKey), // 현재 마지막 데이터를 기준으로 이전 데이터를 가져옴
    limitToLast(5) // 이전 5개
  );

  onValue(prevQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        // 이전 데이터의 마지막 키를 업데이트
        firstVisibleKey = drawsArray[0].key;
        lastVisibleKey = drawsArray[drawsArray.length - 1].key;
        displayPreviousDraws(drawsArray.reverse()); // 역순으로 표시
        pageNumber--;
        updatePageNumber();
        checkPrevButtonVisibility();
      } else {
        alert("더 이상 이전 데이터가 없습니다.");
      }
    }
    isLoading = false;
  }, { onlyOnce: true });
}

function displayPreviousDraws(drawsArray) {
  const lottoListDiv = document.getElementById("lotto-list");
  lottoListDiv.innerHTML = '';

  const sortedDraws = drawsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  sortedDraws.forEach(draw => {
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

  checkPrevButtonVisibility();
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

function checkPrevButtonVisibility() {
  $("#prevPage").prop("disabled", pageNumber === 1);
  $("#nextPage").prop("disabled", pageNumber >= maxPage);
}

function updatePageNumber() {
  document.getElementById("pageNumber").textContent = `${pageNumber}/${maxPage}`;
}

function getLottoWeekNumber() {
  const today = new Date();
  const firstLottoDate = new Date('2002-12-07');
  const diffDays = (today - firstLottoDate) / (1000 * 60 * 60 * 24);
  const weeksPassed = Math.floor(diffDays / 7);

  if (today.getDay() === 6 && today.getHours() >= 21) {
    return weeksPassed + 1;
  }
  return weeksPassed;
}
