'use strict';

(function() {
  let firebaseConfig = {
    apiKey: "AIzaSyDknJyMPJFVQCgCZVZO2Y5niEZaguseisA",
    authDomain: "epic7gearcal.firebaseapp.com",
    databaseURL: "https://epic7gearcal.firebaseio.com",
    projectId: "epic7gearcal",
    storageBucket: "epic7gearcal.appspot.com",
    messagingSenderId: "285803694352",
    appId: "1:285803694352:web:908f16b0f90b6f86327d95"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let provider = new firebase.auth.GoogleAuthProvider();
  let db = firebase.firestore();


  //綁定檢查裝備部位事件
  $('#slot').on('change', function(event) {
    event.preventDefault();
    /* Act on the event */
    checkSlot();
  });

  // 綁定登入
  $('#signInBtn').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    signIn();
  });

  //綁定新增裝備事件
  $('#addGearBtn').on('click', function(event) {
    let formReady = false;
    /* Act on the event */
    formReady = checkGearFrom();
    if (formReady) {
      console.log('準備完畢');
    }
  });

  // 檢查裝備部位
  function checkSlot() {
    let slot = $('#slot').val();
    switch (slot) {
      case 'weapon':
        $('#mainStat-type').val('atk');
        $('#mainStat-type').attr('disabled', true);
        setSubstat(slot);
        break;
      case 'helmet':
        $('#mainStat-type').val('hp');
        $('#mainStat-type').attr('disabled', true);
        setSubstat(slot);
        break;
      case 'armor':
        $('#mainStat-type').val('def');
        $('#mainStat-type').attr('disabled', true);
        setSubstat(slot);
        break;
      case 'necklace':
        $('#mainStat-type').val('');
        $('#mainStat-type').attr('disabled', false);
        setSubstat(slot);
        break;
      case 'ring':
        $('#mainStat-type').val('');
        $('#mainStat-type').attr('disabled', false);
        setSubstat(slot);
        break;
      case 'boots':
        $('#mainStat-type').val('');
        $('#mainStat-type').attr('disabled', false);
        setSubstat(slot);
        break;
      default:
    }
  }

  // 副屬性之選項恢復原狀
  function setSubstat(slot) {
    for (var i = 3; i >= 0; i--) {
      let elem = `#subStat${i+1}-type`;
      let html = `<option value selected disabled hidden>(請選擇屬性)</option>`;
      $(elem).empty();
      switch (slot) {
        case 'weapon':
          html += `
          <option value="atk_p">攻擊%</option>
          <option value="hp">生命</option>
        `;
          break;
        case 'helmet':
          html += `
          <option value="atk">攻擊</option>
          <option value="atk_p">攻擊%</option>
          <option value="def">防禦</option>
          <option value="def_p">防禦%</option>
        `;
          break;
        case 'armor':
          html += `
          <option value="def_p">防禦%</option>
          <option value="hp">生命</option>
        `;
          break;
        case 'necklace':
          html += `
          <option value="atk">攻擊</option>
          <option value="atk_p">攻擊%</option>
          <option value="def">防禦</option>
          <option value="def_p">防禦%</option>
          <option value="hp">生命</option>
        `;
          break;
        case 'ring':
          html += `
          <option value="atk">攻擊</option>
          <option value="atk_p">攻擊%</option>
          <option value="def">防禦</option>
          <option value="def_p">防禦%</option>
          <option value="hp">生命</option>
        `;
          break;
        case 'boots':
          html += `
          <option value="atk">攻擊</option>
          <option value="atk_p">攻擊%</option>
          <option value="def">防禦</option>
          <option value="def_p">防禦%</option>
          <option value="hp">生命</option>
        `;
          break;
        default:
      }
      html += `
      <option value="hp_p">生命%</option>
      <option value="cric">暴擊率</option>
      <option value="crid">暴擊傷害</option>
      <option value="spd">速度</option>
      <option value="eff">效果命中</option>
      <option value="res">效果抗性</option>
    `;
      $(elem).append(html);
    }
  }

  // 檢查裝備輸入表單是否有錯
  function checkGearFrom() {
    let set = $('#set').val();
    let slot = $('#slot').val();
    let mainStatType = $('#mainStat-type').val();
    let mainStat = $('#mainStat').val();
    let subStatType = [];
    let subStat = [];
    let ready = true;
    // 取得所有副屬性的類別和數值
    for (let i = 0; i < 4; i++) {
      subStatType.push($(`#subStat${i+1}-type`).val());
      subStat.push($(`#subStat${i+1}`).val());
    }

    /* 檢查開始 */
    // 檢查所有必填項目已填
    let required = $('input,select').filter('[required]:visible');
    required.each(function() {
      if ($(this).val() == '') {
        console.log('錯誤！套裝、部位和主屬性為必填項目');
        ready = false;
      }
    });
    // 全部副屬性都空的報錯
    if (subStatType[0] == null && subStatType[1] == null && subStatType[2] == null && subStatType[3] == null) {
      console.log('錯誤！不得所有副屬性類別皆留空');
      ready = false;
    }
    // 檢查所有副屬性類別不重複
    if (getDuplicateArrayElements(subStatType).length != 0) {
      let repeat = getDuplicateArrayElements(subStatType);
      let wrongError = true; //預設為誤報
      // 檢查是否是null誤報
      for (let i = 0; i < repeat.length; i++) {
        if (repeat[i] != null) {
          wrongError = false;
        }
      }
      if (!wrongError) {
        console.log('錯誤！副屬性類別不得重複');
        ready = false;
      }
    }
    // 檢查是否有副屬性未有配對的數值
    if (subStatType.filter(item => item != null).length != subStat.filter(item => item != "").length) {
      console.log(subStatType.filter(item => item != null).length);
      console.log(subStat.filter(item => item != "").length);
      console.log('錯誤！請檢查副屬性是否填寫正確');
      ready = false;
    }
    return ready;
  }

  // google登入
  function signIn() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      userData = user;
      // console.log(user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }

  // 登入狀態改變之後的動作
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      console.log(displayName);
      console.log(email);
      console.log(emailVerified);
      console.log(photoURL);
      console.log(isAnonymous);
      console.log(uid);
      console.log(providerData);
      $('.userPhoto').attr('src', photoURL);
      $('.userPhoto').css('display', 'block');
      $('#signInBtn').css('display', 'none');

      // firestore讀寫測試成功
      // db.collection("users").doc(uid).set({
      //     name: displayName,
      // })
      // .then(function(docRef) {
      //     console.log("Document written with ID: ", docRef.id);
      // })
      // .catch(function(error) {
      //     console.error("Error adding document: ", error);
      // });


    } else {
      // User is signed out.
      // ...
      $('.userPhoto').css('display', 'none');
      $('#signInBtn').css('display', 'block');
    }
  });

  // 檢查陣列中重複的數值
  function getDuplicateArrayElements(arr) {
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] === sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }
})();