<?php

/**
 * @file
 * Main view template.
 *
 * Variables available:
 * - $classes_array: An array of classes determined in
 *   template_preprocess_views_view(). Default classes are:
 *     .view
 *     .view-[css_name]
 *     .view-id-[view_name]
 *     .view-display-id-[display_name]
 *     .view-dom-id-[dom_id]
 * - $classes: A string version of $classes_array for use in the class attribute
 * - $css_name: A css-safe version of the view name.
 * - $css_class: The user-specified classes names, if any
 * - $header: The view header
 * - $footer: The view footer
 * - $rows: The results of the view query, if any
 * - $empty: The empty text to display if the view is empty
 * - $pager: The pager next/prev links to display, if any
 * - $exposed: Exposed widget form/info to display
 * - $feed_icon: Feed icon to display, if any
 * - $more: A link to view more, if any
 *
 * @ingroup views_templates
 */
?>
<div class="<?php print $classes; ?>">
  <?php print render($title_prefix); ?>
  <?php if ($title): ?>
    <?php print $title; ?>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <?php if ($header): ?>
    <div class="view-header">
      <?php print $header; ?>
    </div>
  <?php endif; ?>
  <div class="view-inner">
  <?php if ($rows): ?>
    <div class="view-content">
      <div>
       <div class="view-prev">
          <div class="inner">
            <a href="javascript:;"><span class="glyphicon glyphicon-menu-left"></span></a>
          </div>
       </div>
      </div>
      <?php if ($attachment_before): ?>
        <?php print $attachment_before; ?>
      <?php endif; ?>
      <?php print $rows; ?>
      <?php if ($attachment_after): ?>
        <?php print $attachment_after; ?>
      <?php endif; ?>
      <div>
        <div class="view-next">
          <div class="inner">
            <a href="javascript:;"><span class="glyphicon glyphicon-menu-right"></span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
    <?php if ($pager): ?>
    <?php print $pager; ?>
  <?php endif; ?>
  <?php if ($more): ?>
    <?php print $more; ?>
  <?php endif; ?>
  
  <?php endif; ?>
  <?php if ($footer): ?>
    <div class="view-footer">
      <?php print $footer; ?>
    </div>
  <?php endif; ?>
</div><?php /* class view */ ?>
<?php 
if($GLOBALS["user_data"]): 
?>
<script>
var totalRows = <?php echo json_encode($GLOBALS["total_rows"]); ?>;
totalRows.<?=$view->current_display?> = <?=$view->total_rows ?>;
var user_data = <?php echo json_encode($GLOBALS["user_data"]); ?>;
</script>
<?php endif; ?>
