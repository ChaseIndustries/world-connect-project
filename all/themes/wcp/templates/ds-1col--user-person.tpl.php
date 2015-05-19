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
        <div class="person__coords">
          <div class="person__coords__lat">
            <?php print $coords["lat"] ?>,
          </div>
          <div class="person__coords__lng">
            <?php print $coords["lng"] ?>
          </div>
        </div>
        <?php print $ds_content; ?>
      </div>
    </div>
      <div class="person__body">
      <img type="image/svg" src="svg/user/<?=$user->uid?>" class="person__svg" onload='user_list.showUser(this)' width="100%" height="100%" /></div>
</<?php print $ds_content_wrapper ?>>