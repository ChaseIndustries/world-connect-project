<?php

/*
error_reporting(E_ALL);
ini_set('display_errors', '1');
*/


drupal_add_js(drupal_get_path('theme', 'wcp') . '/js/connect.js', array('type' => 'file', 'scope' => 'footer'));

/**
 * Override or insert variables into the html template.
 */
function wcp_preprocess(&$variables, $hook) {
  $variables["theme_dir"] = path_to_theme();
  switch($hook){
    case "user_profile":
      $user = $variables["elements"]["#account"];
      $variables["user"] = $user;
      $location = count($user->field_location) ? $user->field_location["und"][0] : false;
      $variables["coords"] = $location ? $location : array("lat"=>"&nbsp;", "lng" => "&nbsp;");
      $variables["attributes_array"]["rel"] = $user->uid;
    break;
  }
}

function wcp_js_alter(&$javascript){
  // Swap out jQuery to use an updated version of the library.
  $javascript['misc/jquery.js']['data'] = drupal_get_path('theme', 'wcp') . "/js/vendor/jquery-1.11.2.min.js";
}

function wcp_preprocess_page(&$variables) {
  global $user;
  $variables["is_admin"] = in_array('administrator', array_values($user->roles));
}
