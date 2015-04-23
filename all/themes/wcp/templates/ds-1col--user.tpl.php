<?php

/**
 * @file
 * Display Suite 1 column template.
 */
?>
<<?php print $ds_content_wrapper; print $layout_attributes; ?> class="ds-1col person <?php print $classes;?> clearfix">
    <img class="person__loader" src="<?php echo drupal_get_path('theme', 'wcp') ?>/images/loader.svg" />
    <div class="person__inner">
      <div class="person__fields">
        <h2 class="person__name"><?php print $user->name ?></h2>
        <div class="person__coords"><?php print $coords ?></div>
              <?php print $ds_content; ?>
      </div>
    </div>
      <div class="person__body"><!-- <object type="image/svg+xml" class="person__svg" data="/sites/all/modules/custom/user_list/images/people/man.svg.php?user=<?=urlencode(json_encode($user)) ?>" width="100%" height="100%">Your browser doesn't support modern SVG images.  Please <a href="http://browsehappy.com">upgrade your browser</a>.</object> -->
      <img type="image/svg" src="svg/user/<?=$user->uid?>" class="person__svg" width="100%" height="100%" /></div>
</<?php print $ds_content_wrapper ?>>