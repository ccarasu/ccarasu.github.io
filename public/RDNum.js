import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push, onValue, query, limitToFirst, startAfter } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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
let pageCount = 1;
const maxPages = 50;

$(function () {
  // 햄버거 메뉴 클릭 시 메뉴 열기/닫기
  $(".mobile_menu").click(function () {
    $(".nav-menu").toggleClass("open");
    $("body").css("overflow", $(".nav-menu").hasClass("open") ? "hidden" : "auto");
  });

  // X 버튼 클릭 시 메뉴 닫기
  $("#closeMenu").click(function () {
    $(".nav-menu").removeClass("open");
    $("body").css("overflow", "auto");
  });

  // "다음 페이지" 버튼 클릭 시 새로운 페이지 로드
  $("#nextPage").click(function () {
    loadMoreDraws("next");
  });
  // "이전 페이지" 버튼 클릭 시 이전 페이지 로드
  $("#prevPage").click(function () {
    loadMoreDraws("prev");
  });

  // 처음 5개의 로또 결과를 로드
  loadMoreDraws();

  // 로또 데이터를 페이지 단위로 가져오는 함수
  function loadMoreDraws() {
    let isLoading = false;
    if (isLoading) return;
    isLoading = true;

    let drawsQuery = ref(database, 'lottoDraws');
    if (lastKey) {
      drawsQuery = query(drawsQuery, startAfter(lastKey), limitToFirst(10));
    } else {
      drawsQuery = query(drawsQuery, limitToFirst(5));
    }

    onValue(drawsQuery, (snapshot) => {
      const drawsData = snapshot.val();
      if (drawsData) {
        const drawsArray = Object.values(drawsData);
        lastKey = drawsArray[drawsArray.length - 1].drawNumber;

        // 화면에 데이터 표시
        displayPreviousDraws(drawsData);

        pageCount++;
      }
      isLoading = false;
    });
  }

  $("#CreateNumber").click(function () {
    const lotto_numbers = document.getElementById('lotto-numbers');
    lotto_numbers.innerHTML = '';

    const lottoNumber = new Array(6);
    for (let i = 0; i < lottoNumber.length; ) {
      const number = Math.floor(Math.random() * 45) + 1;
      if (!lottoNumber.includes(number)) {
        lottoNumber[i] = number;
        i++;
      }
    }

    lottoNumber.sort((a, b) => a - b);

    const newDiv = document.createElement('div');
    newDiv.className = 'lotto-result';

    lottoNumber.forEach(function(number) {
      const span = document.createElement('span');
      span.textContent = number;
      span.classList.add('ball');
      if (number >= 1 && number <= 10) span.classList.add('yellow');
      else if (number >= 11 && number <= 20) span.classList.add('blue');
      else if (number >= 21 && number <= 30) span.classList.add('red');
      else if (number >= 31 && number <= 40) span.classList.add('gray');
      else if (number >= 41 && number <= 45) span.classList.add('green');
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
    const formattedTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;

    const timeNow = document.getElementById('lotto-time');
    timeNow.innerHTML = `${formattedTime}`;

    const drawData = {
      drawNumber: latestDrawNumber,
      numbers: lottoNumber,
      createdAt: formattedTime,
    };

    const drawsRef = ref(database, "lottoDraws");
    push(drawsRef, drawData)
      .then(() => {
        console.log("데이터 저장 성공:", drawData);
      })
      .catch((error) => {
        console.error("데이터 저장 실패: ", error);
      });
  });

  // Firebase Realtime Database에서 실시간 데이터 가져오기
  const drawsRef = ref(database, "lottoDraws");
  onValue(drawsRef, (snapshot) => {
    const drawsData = snapshot.val();
    if (drawsData) {
      //최신 데이터만 화면에 표시
      displayPreviousDraws(drawsData);
    } else {
      console.log("No data available");
    }
  });

  function displayPreviousDraws(drawsData) {
    const lottoListDiv = document.getElementById("lotto-list");
    lottoListDiv.innerHTML = '';

    // drawsData를 배열로 변환 후 정렬 (최신 순)
    const drawsArray = Object.values(drawsData).sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
      
    // 최대 5개의 항목만 처리
    const latestDraws = drawsArray.slice(0, 5);

    latestDraws.forEach(draw => {
        const drawDiv = document.createElement("div");
        drawDiv.className = "lotto-draw";

        const drawNumber = document.createElement("div");
        drawNumber.textContent = `${draw.drawNumber}회 로또 생성 번호`;
        drawNumber.className = 'Previous-draw-info';

        const numbersDiv = document.createElement("div");
        numbersDiv.className = 'Previous-list';

        draw.numbers.forEach(function (number) {
            const span = document.createElement('span');
            span.textContent = number;
            span.classList.add('ball');
            if (number >= 1 && number <= 10) span.classList.add('yellow');
            else if (number >= 11 && number <= 20) span.classList.add('blue');
            else if (number >= 21 && number <= 30) span.classList.add('red');
            else if (number >= 31 && number <= 40) span.classList.add('gray');
            else if (number >= 41 && number <= 45) span.classList.add('green');
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
});

// 최신 로또 회차 구하는 함수
function getLottoWeekNumber() {
  const today = new Date();
  const firstLottoDate = new Date('2002-12-07');
  const diffTime = today - firstLottoDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const weeksPassed = Math.floor(diffDays / 7);

  const todayDay = today.getDay();
  const todayHours = today.getHours();
  if (todayDay === 6 && todayHours < 20) {
    return weeksPassed;
  }
  return weeksPassed + 1;
}
