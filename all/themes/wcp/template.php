<?php

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
      $variables["coords"] = $location ? $location["lat"] . ", " . $location["lng"] : "";
      $variables["attributes_array"]["rel"] = $user->uid;
    break;
  }
}

function wcp_js_alter(&$javascript){
  // Swap out jQuery to use an updated version of the library.
  $javascript['misc/jquery.js']['data'] = drupal_get_path('theme', 'wcp') . "/js/vendor/jquery-1.11.2.min.js";
}
