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


// 檢查裝備部位
function checkSlot() {
  let slot = $('#slot').val();
  switch ( slot ){
    case 'weapon':
      $('#mainStat-type').val('atk');
      $('#mainStat-type').attr('disabled', true);
      break;
    case 'helmet':
      $('#mainStat-type').val('hp');
      $('#mainStat-type').attr('disabled', true);
      break;
    case 'armor':
      $('#mainStat-type').val('def');
      $('#mainStat-type').attr('disabled', true);
      break;
    case 'necklace':
      $('#mainStat-type').val('');
      $('#mainStat-type').attr('disabled', false);
      break;
    case 'ring':
      $('#mainStat-type').val('');
      $('#mainStat-type').attr('disabled', false);
      break;
    case 'boots':
      $('#mainStat-type').val('');
      $('#mainStat-type').attr('disabled', false);
      break;
    default:
  }
}