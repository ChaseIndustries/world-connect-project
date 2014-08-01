<div ng-app="connect" class="row-fluid wrapper">
	<div class="inner-wrapper">
		<div class="login col-md-2">
			Login form here
		</div>
		<?php views_get_view("list_users")->render('block'); ?>
		<?php print render($page['content']); ?>
	</div>
	<script>
	var user_list = <?=json_encode($user_list)?>;
	var theme_dir = "<?=$theme_dir?>";
	</script>
	<div class="front-map container"><div id="map"></div></div>
</div>
