<?php

function user_list_views_query_alter(&$view, &$query) {
  global $user;
  // (Example assuming a view with an exposed filter on node title.)
  // If the input for the title filter is a positive integer, filter against
  // node ID instead of node title.
  //$created_date = format_date($user->created, "custom", "y-m-d H:i:s");
  if($user->uid > 0){ //user is logged in
    $created_date = $user->created;
    if ($view->name == 'list_users'){
      $filters = $query->where[1]["conditions"]; 
      if($view->current_display == "uids_less") {
       $query->where[1]["conditions"][] = array("field" => "users.created < ".$created_date, "value" =>  array(), "operator" => "formula"); 
      }
      if($view->current_display == "uids_greater") {
        $query->where[1]["conditions"][] = array("field" => "users.created > ".$created_date, "value" =>  array(), "operator" => "formula");
      }
    }
  }
}