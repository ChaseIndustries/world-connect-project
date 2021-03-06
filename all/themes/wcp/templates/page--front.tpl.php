<?php
/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see bootstrap_preprocess_page()
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see bootstrap_process_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>
<div class="wrapper">
<?php  if($is_admin) { ?>
  <div class="messages-container">
  <?php print $messages; ?>
  </div>
<?php } ?>
<?php
global $user;
if(!$logged_in || $is_admin){ ?>
		<div class="login-register modal">
		  <div class="modal__inner">
		    <div class="modal__content">
		      <a class="login-link" href="/user">Already Registered?</a>
		      <h2>Join the Chain</h2>
		      <a href="javascript:;" class="modal__close js__login-register__toggle">&times;</a>
		      <div class="row">
		        <?php if($messages){ ?>
		        <div class='col-sm-12'>
		         <div class="messages-container">
              <?php print $messages; ?>
             </div>
            </div>
            <?php } ?>
    		    <div class="col-sm-12 login-register__register">
<!--
    		    		      <label>Login with Facebook:</label>
		      <div class='fb-login-button'><a href='/user/simple-fb-connect'>Connect with Facebook</a></div>
-->
          <div id="status"></div>
          <br>
    		    <? $register_form = drupal_get_form('user_register_form'); ?>
    		    <? print(drupal_render($register_form)); ?>
      		    <div class='people-container'>
      		      <object id="svg_person_male" type="image/svg+xml" onload="loadSvg(this)"class="person-form male" data="<?php print base_path() . drupal_get_path('module', 'user_list') ?>/images/people/male.svg"></object>
      		      <object id="svg_person_female" type="image/svg+xml" onload="loadSvg(this)" class='person-form female' data='<?php print base_path() . drupal_get_path('module', 'user_list') ?>/images/people/female.svg'/></object>
      		    </div>
    		    </div>
  		    </div>
  		    <div class="clearfix"></div>
		    </div>
		  </div>
		</div>
<?php } ?>
	<script>
	var theme_dir = "<?=$theme_dir?>";
	</script>
	<div class="content-wrapper front">
	<div class='map-loader'><img src='<?php print base_path() . drupal_get_path('theme','wcp') . '/images/loader_2.svg'?>'/><br>Loading Map...</div>
	<div class="front-map"><div id="map"></div></div>
    <?php print render($page['content']); ?>
<div class="push"></div>
<div class='inner'></div>
</div>
  <footer class="footer">
    <div class="footer__top">
      <?php print render($page['footer_top']); ?>
    </div>
    <div class="footer__bottom">
      <div class="footer__inner container">
         <div align="center">
      <div
  class="fb-like"
  data-share="true"
  data-width="450"
  data-show-faces="true">
</div>
      </div>
        <?php print render($page['footer']); ?>
      </div>
    </div>
  </footer>
</div><!-- /.wrapper-->