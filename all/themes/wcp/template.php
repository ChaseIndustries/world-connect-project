<?php

/**
 * Override or insert variables into the html template.
 */
function wcp_preprocess(&$variables, $hook) {
  //$variables["user_list"] = views_get_view_result("list_users");
  $variables["theme_dir"] = path_to_theme();
}
function wcp_js_alter(&$javascript){
  // Swap out jQuery to use an updated version of the library.
  $javascript['misc/jquery.js']['data'] = "//code.jquery.com/jquery-1.7.1.min.js";
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
