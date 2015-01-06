<?php

function user_list_views_query_alter(&$view, &$query) {
  global $user;
  // (Example assuming a view with an exposed filter on node title.)
  // If the input for the title filter is a positive integer, filter against
  // node ID instead of node title.
   
  if ($view->name == 'list_users'){
    $filters = $query->where[1]["conditions"]; 
    if($view->current_display == "uids_less") {
     $query->where[1]["conditions"][] = array("field" => "users.created < ".$user->created, "value" =>  array(), "operator" => "formula"); 
    }
    if($view->current_display == "uids_greater") {
      $query->where[1]["conditions"][] = array("field" => "users.created > ".$user->created, "value" =>  array(), "operator" => "formula");
    }
  }
}

function user_list_views_post_render(&$view){
  if($view->name == "list_users"){
   //modify to attach the attachment with the main rows
  }
}
