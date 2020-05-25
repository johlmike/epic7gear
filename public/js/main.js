document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }
});

//綁定檢查裝備部位事件
$('#slot').on('change', function(event) {
  event.preventDefault();
  /* Act on the event */
  checkSlot();
});

//綁定新增裝備事件
$('#addGearBtn').on('click', function(event) {
  // event.preventDefault();
  /* Act on the event */
  checkGearFrom();
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
    switch (slot){
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

  //取得所有副屬性的類別和數值
  for (let i = 0; i < 4; i++) {
    subStatType.push($(`#subStat${i+1}-type`).val());
    subStat.push($(`#subStat${i+1}`).val());
  }

  // 全部副屬性都空的報錯
  if( subStatType[0] == null && subStatType[1] == null && subStatType[2] == null && subStatType[3] == null ){
    console.log('錯誤！不得所有副屬性類別皆留空');
    return false;
  }
  // 檢查所有副屬性類別不重複
  if( getDuplicateArrayElements(subStatType).length != 0 ){
    let repeat = getDuplicateArrayElements(subStatType);
    let wrongError = true; //預設為誤報
    // 檢查是否是null誤報
    for (let i = 0; i < repeat.length; i++) {
      if( repeat[i] != null ){
        wrongError = false;
      }
    }
    if( !wrongError ){
      console.log('錯誤！副屬性類別不得重複');
      return false;
    }
  } 
}




// 檢查陣列中重複的數值
function getDuplicateArrayElements(arr){
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
}