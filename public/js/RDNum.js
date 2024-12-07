// Firebase 초기화 (변경 없음)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, onValue, query, orderByChild, limitToLast, startAfter, endBefore, push } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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
const auth = getAuth(app);
// 상태 변수
let lastVisibleKey = null;  // 마지막 데이터 키
let firstVisibleKey = null; // 첫 번째 데이터 키
let isLoading = false; // 로딩 상태
let allDrawsLoaded = false; // 모든 데이터 로드 여부

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

  const loginLink = $("#login-link");

  onAuthStateChanged(auth, (user) => {
    if (user) {
        // 로그인한 경우: 마이페이지로 이동
        loginLink.attr("href", "pages/mypage.html"); // 마이페이지 링크로 변경
      } else {
        // 로그인하지 않은 경우: 로그인 페이지로 이동
        loginLink.attr("href", "pages/login.html"); // 로그인 페이지 링크로 변경
      }
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
    const month = (generatedTime.getMonth() + 1).toString().padStart(2, '0');
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

  // 데이터 로드
  loadInitialDraws();

  // "다음" 버튼 클릭
  $("#nextPage").click(function () {
    if (!isLoading && !allDrawsLoaded) {
      loadNextDraws();
    }
  });

  // "이전" 버튼 클릭
  $("#prevPage").click(function () {
    if (!isLoading && firstVisibleKey) {
      loadPreviousDraws();
    }
  });
});

// 초기 데이터 로드: 최신 5개
function loadInitialDraws() {
  const initialQuery = query(
    ref(database, "lottoDraws"),
    orderByChild("createdAt"),
    limitToLast(5) // 최신 5개 데이터 가져오기
  );

  onValue(initialQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      drawsArray.reverse(); // 가장 최근 데이터가 상단에 오도록 정렬
      firstVisibleKey = drawsArray[0].key;
      lastVisibleKey = drawsArray[drawsArray.length - 1].key;
      displayPreviousDraws(drawsArray); // 화면에 데이터 표시
    }
  });
}

// "다음 버튼" 클릭 시 이전 5개 데이터 추가 로드
function loadNextDraws() {
  if (!lastVisibleKey || isLoading) return;
  isLoading = true;

  const nextQuery = query(
    ref(database, "lottoDraws"),
    orderByChild("createdAt"),
    endBefore(lastVisibleKey), // 마지막 데이터 이전
    limitToLast(5) // 이전 5개 데이터
  );

  onValue(nextQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        firstVisibleKey = drawsArray[0].key;
        lastVisibleKey = drawsArray[drawsArray.length - 1].key;
        displayPreviousDraws(drawsArray.reverse()); // 데이터 표시
      } else {
        allDrawsLoaded = true; // 더 이상 데이터가 없으면 플래그 설정
        alert("더 이상 데이터가 없습니다.");
      }
    }
    isLoading = false;
  });
}

// "이전 버튼" 클릭 시 다음 5개 데이터 로드
function loadPreviousDraws() {
  if (!firstVisibleKey || isLoading) return;
  isLoading = true;

  const prevQuery = query(
    ref(database, "lottoDraws"),
    orderByChild("createdAt"),
    startAfter(firstVisibleKey), // 첫 번째 데이터 이후
    limitToLast(5) // 이후 데이터 최대 5개
  );

  onValue(prevQuery, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      const drawsArray = Object.entries(drawsData).map(([key, value]) => ({ key, ...value }));
      if (drawsArray.length > 0) {
        firstVisibleKey = drawsArray[0].key;
        lastVisibleKey = drawsArray[drawsArray.length - 1].key;
        displayPreviousDraws(drawsArray.reverse()); // 데이터 표시
      } else {
        alert("더 이상 이전 데이터가 없습니다.");
      }
    }
    isLoading = false;
  });
}

// 데이터 표시 함수
function displayPreviousDraws(drawsArray) {
  const lottoListDiv = document.getElementById("lotto-list");
  lottoListDiv.innerHTML = ''; // 기존 데이터 삭제

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
}

// 볼 색상 계산 함수
function getBallColor(number) {
  if (number >= 1 && number <= 10) return 'yellow';
  if (number >= 11 && number <= 20) return 'blue';
  if (number >= 21 && number <= 30) return 'red';
  if (number >= 31 && number <= 40) return 'gray';
  if (number >= 41 && number <= 45) return 'green';
}

// 로또 주차 계산
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
