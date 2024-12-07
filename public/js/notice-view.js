import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get, runTransaction } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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
const database = getDatabase(app);

// URL에서 index 값 추출
const idx = location.search;
const index = idx.split("=")[1];

// notices 데이터 가져오기
const noticesRef = ref(database, 'notices');
get(noticesRef).then((snapshot) => {
  if (snapshot.exists()) {
    const noticesObj = snapshot.val();
    let notice = null;
    let noticeKey = null;

    // index에 해당하는 데이터를 찾기
    for (const key in noticesObj) {
      if (noticesObj[key].index === parseInt(index)) {
        notice = noticesObj[key];
        noticeKey = key; // 고유 key 저장
        break;
      }
    }

    if (notice && noticeKey) {
      // 로컬 스토리지에서 이미 조회한 공지인지 확인
      const viewedNotices = JSON.parse(localStorage.getItem('viewedNotices')) || [];

      // 이미 본 공지사항인지 체크
      if (!viewedNotices.includes(noticeKey)) {
        // 조회수 업데이트
        const noticeRef = ref(database, `notices/${noticeKey}`);
        runTransaction(noticeRef, (currentData) => {
          if (currentData) {
            currentData.views = (currentData.views || 0) + 1;
            currentData.refresh = true; // 한 번 조회되면 refresh 값을 true로 설정
          }
          return currentData;
        }).then(() => {
          console.log("조회수 업데이트 성공");
        }).catch((error) => {
          console.error("조회수 업데이트 실패:", error);
        });

        // 조회한 공지 목록에 추가
        viewedNotices.push(noticeKey);
        localStorage.setItem('viewedNotices', JSON.stringify(viewedNotices));
      }

      // 데이터 출력
      const viewForm = document.querySelectorAll("#ViewForm > div");
      for (let i = 0; i < viewForm.length; i++) {
        const id = viewForm[i].id;
        viewForm[i].innerHTML += "" + notice[id];
      }

    } else {
      console.log("해당 index에 대한 공지를 찾을 수 없습니다:", index);
    }

  } else {
    console.log("공지 데이터가 존재하지 않습니다.");
  }
}).catch((error) => {
  console.error("데이터 로드 실패:", error);
});
