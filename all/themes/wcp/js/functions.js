function waitForObject(payload) {
  window.setTimeout(function(){
    if(typeof(user_list.showUser) !== 'undefined'){
      user_list.showUser(payload);
      return;
    } else { 
      waitForObject(payload);
    }
  }, 10);
}