import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'; 
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';


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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
  
  $(".back-button").click(function () {
    history.back();
  });
});


const clientId = 'vATwfiRL5UC1PEWiOk6X'; // 네이버 API 클라이언트 ID
const clientSecret = 'Kb0KefiSjR'; // 네이버 API 클라이언트 시크릿

let currentPage = 1; // 현재 페이지 번호
const articlesPerPage = 5; // 페이지당 기사 수
let totalArticles = 0; // 전체 기사 수

// 뉴스 API 호출 함수
function fetchNews(query, page = 1) {
    const start = (page - 1) * articlesPerPage + 1; // 시작 인덱스 계산
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${articlesPerPage}&start=${start}`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Naver-Client-Id", clientId);
            xhr.setRequestHeader("X-Naver-Client-Secret", clientSecret);
        },
        success: function(response) {
            totalArticles = response.total; // 전체 기사 수 저장
            const articles = response.items;
            displayArticles(articles, page);
            updatePagination(query); // 페이지네이션 업데이트
        },
        error: function(error) {
            console.error('Error fetching news:', error);
        }
    });
}

// 기사 목록 표시 함수
function displayArticles(articles, page) {
    const articlesContainer = document.querySelector('.articles');
    if (page === 1) {
        articlesContainer.innerHTML = ''; // 첫 페이지 로드 시 기존 기사 목록 초기화
    }

    articles.forEach(article => {
        const articleItem = document.createElement('li');
        articleItem.classList.add('article-item');
        articleItem.innerHTML = `
            <h3><a href="${article.link}" target="_blank">${article.title}</a></h3>
            <p>${article.description}</p>
        `;
        articlesContainer.appendChild(articleItem);
    });
}

// 페이지네이션 UI 업데이트
function updatePagination(query) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // 기존 페이지네이션 초기화

    const totalPages = Math.ceil(totalArticles / articlesPerPage); // 전체 페이지 수 계산

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function () {
            currentPage = i;
            fetchNews(query, i); // 선택된 페이지의 기사 요청
        });
        paginationContainer.appendChild(pageButton);
    }
}

// 검색 버튼 클릭 시 뉴스 검색
document.querySelector('button[type="submit"]').addEventListener('click', function() {
    const searchQuery = document.getElementById('search').value.trim();
    if (searchQuery !== '') {
        currentPage = 1; // 검색 시 첫 페이지로 초기화
        fetchNews(searchQuery, currentPage);
    } else {
        alert('검색어를 입력하세요.');
    }
});
