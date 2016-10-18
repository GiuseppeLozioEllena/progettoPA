<?php
	ini_set('max_execution_time', 300);
	
	$projection = array("Square", "Mercator", "Transverse Mercator", "Icosahedral", "Mollweide", "Sinusoidal", "Spherical", "Animated Globe", "Polar Orthographic", "Polar Stereographic", "Polar Gnomonic");
	$palette = array("Olsson", "Mogensen", "Atlas", "Antique", "Barren", "Martian", "Chthonian", "Greyscale", "Landmask");
	
	for ($index = 80; $index <= 100; $index++)
	{
		$seed = Rand(1, 10000000000);
		$palette_index = Rand(1, 7); // Evita l'ultima
		$water = Rand(0, 100);
		$ice = Rand(0, 100);
		$height = 1000;
		$iterations = Rand(1000, 25000);
		$rotation = 0;
		$projection_index = Rand(0, 10);
		$projection_index = 1; // Fisso a "Square"
		
		$url = "http://worldgen.bin.sh/worldgen.cgi?palette=" . $palette[$palette_index] . "&iter=$iterations&cmd=Create&name=Wedi%20Prime&pct_ice=$ice&height=$height&seed=$seed&rotate=$rotation&pct_water=$water&projection=" . $projection[$projection_index] . "&motif=SciFi";	
		$html = file_get_contents($url);
		
		$f = fopen("./textures/planets_downloaded/texture" . $index. ".jpg", "w");
		fwrite($f, $html);
		fclose($f);
		
		$name = findName();
		$o = $name."\n";
		$fields = array(
					'name'=>urlencode($name),
					'seed'=>urlencode($seed),
					'projection'=>urlencode($projection[$projection_index]),
					'palette'=>urlencode($palette[$palette_index]),
					'pct_water'=>urlencode($water),
					'pct_ice'=>urlencode($ice),
					'height'=>urlencode($height),
					'iter'=>urlencode($iter),
					'rotate'=>urlencode($rotate),
					'cmd'=>urlencode("Create"),
					'motif'=>urlencode("Scifi")
				);

		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		$fields_string = rtrim($fields_string,'&');

		$ch = curl_init();

		curl_setopt($ch,CURLOPT_URL, "http://donjon.bin.sh/scifi/world/index.cgi");
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		//execute post
		$result = curl_exec($ch);
		
		$result = substr($result, strpos($result, '<table class="stats">'));
		$result = substr($result, 0, strpos($result, '<!-- END OF CONTENT -->'));
		
		do
		{
			$result = substr($result, strpos($result, '<td class="section') + strlen("<td class=\"section\">"));
			if (strpos($result, '<td class="section') !== false)
				$info = elabora(substr($result, 0 , strpos($result, '<td class="section')));
			else
				$info = elabora($result);
			
			$o .= "SECTION=";
			$o .= $info[0] . "\n";
			for ($i = 0; $i < $info[3]; $i++)
				$o .= $info[1][$i] . "=" . $info[2][$i] . "\n";
		}while(strpos($result, '<td class="section') !== false);
		
		$f = fopen("./planets_info/info" .$index . ".txt", "w");
		fwrite($f, $o);
		fclose($f);
	}
	
	echo "Ok";
	
	function elabora($s)
	{
		$section_title = substr($s, 0, strpos($s, "</td>"));
		$i = 0;
		do{
			$s = substr($s, strpos($s, '<td class="key">') + strlen("<td class=\"key\">"));
			$fields[$i] = substr($s, 0, strpos($s, "</td>"));
			$s = substr($s, strpos($s, '<td class="value">') + strlen("<td class=\"value\">"));
			$value[$i] = substr($s, 0, strpos($s, "</td>"));
			$i++;
		}while(strpos($s, '<td class="key">') !== false);
		return array($section_title, $fields, $value, $i);
	}
	
	function findName()
	{
		$html = file_get_contents("http://donjon.bin.sh/scifi/world/");
		$html = substr($html, strpos($html, 'id="in-name" name="name" value="') + strlen('id="in-name" name="name" value="'));
		$html = substr($html, 0, strpos($html, '"'));
		return $html;
	}
?>