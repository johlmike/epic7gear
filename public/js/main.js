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

  // 全域變數設定
  let userID;

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
    event.preventDefault();
    let formReady = false;
    /* Act on the event */
    formReady = checkGearFrom();
    if (formReady) {
      sendGearForm();
    }
  });

  //綁定匯入裝備事件
  $('#importCsvBtn').on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    setGearByCSV();
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
      let html = `<option value selected>(請選擇屬性)</option>`;
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
    if (subStatType[0] == "" && subStatType[1] == "" && subStatType[2] == "" && subStatType[3] == "") {
      console.log('錯誤！不得所有副屬性類別皆留空');
      ready = false;
    }
    // 檢查所有副屬性類別不重複
    if (getDuplicateArrayElements(subStatType).length != 0) {
      let repeat = getDuplicateArrayElements(subStatType);
      let wrongError = true; //預設為誤報
      // 檢查是否是null誤報
      for (let i = 0; i < repeat.length; i++) {
        if (repeat[i] != "") {
          wrongError = false;
        }
      }
      if (!wrongError) {
        console.log('錯誤！副屬性類別不得重複');
        ready = false;
      }
    }
    // 檢查是否有副屬性未有配對的數值
    for (var i = 0; i < subStatType.length; i++) {
      if (subStatType[i] != "") {
        if (subStat[i] == "") {
          console.log('錯誤！請檢查副屬性是否填寫正確');
          ready = false;
        }

      } else {
        if (subStat[i] != "") {
          console.log('錯誤！請檢查副屬性是否填寫正確');
          ready = false;
        }
      }
    }
    return ready;
  }

  function sendGearForm() {
    let set = $('#set').val();
    let slot = $('#slot').val();
    let mainStatType = $('#mainStat-type').val();
    let mainStat = $('#mainStat').val();
    let subStatType = [];
    let subStat = [];
    let uuid = generateUUID();
    let json;
    // 取得所有副屬性的類別和數值
    for (let i = 0; i < 4; i++) {
      if ($(`#subStat${i+1}-type`).val() != "") {
        subStatType.push($(`#subStat${i+1}-type`).val());
      }
      if ($(`#subStat${i+1}`).val() != "") {
        subStat.push($(`#subStat${i+1}`).val());
      }
    }
    // firestore讀寫測試成功
    db.collection("users").doc(userID).collection("gearlist").add({
        set: set,
        slot: slot,
        mainStatType: mainStatType,
        mainStat: mainStat,
        subStatType: subStatType,
        subStat: subStat,
        used: false,
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        getAllGear();
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  function getAllGear() {
    db.collection("users").doc(userID).collection("gearlist").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log("套裝", " => ", doc.data().set);
      });
    });
  }

  function setGearByCSV() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }

    let input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
      alert("請選擇CSV檔案，再點選匯入");
    } else {
      let file = input.files[0];
      let fr = new FileReader();
      Papa.parse(file, {
        complete: function(results) {
          console.log("Finished:", results.data.slice(1));
          convertCSVresult(results.data.slice(1));
        }
      });
    }
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
      // console.log(displayName);
      // console.log(email);
      // console.log(emailVerified);
      // console.log(photoURL);
      // console.log(isAnonymous);
      // console.log(uid);
      // console.log(providerData);
      userID = uid;
      $('.userPhoto').attr('src', photoURL);
      $('.userPhoto').css('display', 'block');
      $('#signInBtn').css('display', 'none');
    } else {
      // User is signed out.
      // ...
      $('.userPhoto').css('display', 'none');
      $('#signInBtn').css('display', 'block');
    }
  });

  // 轉換csv輸出結果
  function convertCSVresult(ary) {
    let gears = ary.map(function(gear, index) {
      let output = {};
      gear.forEach(function(stat, index) {
        if (index == 0) {
          switch (stat) {
            case '武器':
              output.slot = 'weapon';
              break;
            case '頭盔':
              output.slot = 'helmet';
              break;
            case '盔甲':
              output.slot = 'armor';
              break;
            case '項鍊':
              output.slot = 'necklace';
              break;
            case '戒指':
              output.slot = 'ring';
              break;
            case '鞋子':
              output.slot = 'boots';
              break;
          }
        } else if (index == 1) {
          switch (stat) {
            case '攻擊':
              output.set = 'attack';
              break;
            case '防禦':
              output.set = 'defense';
              break;
            case '生命':
              output.set = 'health';
              break;
            case '速度':
              output.set = 'speed';
              break;
            case '暴擊':
              output.set = 'critical';
              break;
            case '破滅':
              output.set = 'destruction';
              break;
            case '命中':
              output.set = 'hit';
              break;
            case '抵抗':
              output.set = 'resist';
              break;
            case '吸血':
              output.set = 'lifesteal';
              break;
            case '反擊':
              output.set = 'counter';
              break;
            case '夾攻':
              output.set = 'unity';
              break;
            case '免疫':
              output.set = 'immunity';
              break;
            case '憤怒':
              output.set = 'rage';
              break;
          }
        } else {
          if (stat != ""){
            switch (index) {
              case 2:
                output.atk = stat;
                break;
              case 3:
                output.atk_p = stat;
                break;
              case 4:
                output.def = stat;
                break;
              case 5:
                output.def_p = stat;
                break;
              case 6:
                output.hp = stat;
                break;
              case 7:
                output.hp_p = stat;
                break;
              case 8:
                output.spd = stat;
                break;
              case 9:
                output.cric = stat;
                break;
              case 10:
                output.crid = stat;
                break;
              case 11:
                output.eff = stat;
                break;
              case 12:
                output.res = stat;
                break;
            }
          }
        }
      });
      return output;
    });
    // gears = gears.filter(function(gear){
    //   console.log(Object.keys(gear).length);
    //   console.log(Object.keys(gear).length != 0);
    //   return Object.keys(gear).length != 0;
    // });

    gears = gears.filter(gear => Object.keys(gear).length != 0);

    console.log(gears);
  }

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

  // 產生UUID
  function generateUUID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };
})();