function waitForObject(i){window.setTimeout(function(){return"undefined"!=typeof user_list?(user_list.showUser(i),void initPage()):void waitForObject(i)},10)}