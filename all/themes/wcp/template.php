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

/*
function wcp_theme() {
     $items = array();
     $items['user_login'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'wcp') . '/templates',
    'template' => 'user-login',
    'preprocess functions' => array(
       'wcp_preprocess_user_login'
    ),
  );
  return $items;
}
*/
/*
function wcp_preprocess_user_login(&$vars) {
  $vars['intro_text'] = t('This is my awesome login form');
}
function wcp_preprocess_user_register_form(&$vars) {
  $vars['intro_text'] = t('This is my super awesome reg form');
}
function wcp_preprocess_user_pass(&$vars) {
  $vars['intro_text'] = t('This is my super awesome request new password form');
}
*/
