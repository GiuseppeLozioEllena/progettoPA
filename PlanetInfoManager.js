/*
 * PlanetInfoManager
 * Classe che si occupa di gestire le informazioni sul pianeta selezionato a runtime
 */
PlanetInfoManager = function()
{
	this.selectedPlanet = null;
	this.active = false;
	this.hideDiv = hideDiv;
	this.showDiv = showDiv;
	
	this.loadInfoFromFile = loadInfoFromFile;
	this.store = store;	
	this.sezioni = [];
	
	this.show = show;
	
	this.name = "";
	
	this.showPlanetName = showPlanetName;
	this.hideAll = hideAll;
	
	/*
	 * hideDiv
	 * Nasconde il div di nome divName
	 */
	function hideDiv(divName)
	{
		document.getElementById(divName).style.display = 'none'; 
	}
	
	/*
	 * hideDiv
	 * Mostra il div di nome divName
	 */
	function showDiv(divName)
	{
		document.getElementById(divName).style.display = 'block'; 
	}
	
	/*
	 * loadInfoFromFile
	 * Legge le informazioni dai file
	 */
	function loadInfoFromFile(file)
	{
	    var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					var allText = rawFile.responseText;
					store(allText);
				}
			}
		}
		rawFile.send(null);
	}
	
	/*
	 * store
	 * Salva le informazioni del pianeta
	 */
	function store(planet_info)
	{
		var righe = planet_info.split("\n"); 
		name = righe[0];
		var sezione = null;
		sezioni = [];
		for (var i = 1; i < righe.length; i++)
		{
			if (righe[i].startsWith("SECTION"))
			{
				if (sezione != null)
					sezioni.push(sezione);
				var fields = righe[i].split('=');
				sezione = new PlanetInfoSection(fields[1]);
			}
			else
				sezione.addInfo(righe[i]);
		}
	}
	
	/*
	 * show
	 * Mostra le informazioni dei pianeti
	 */
	function show()
	{
		showPlanetName(name);
		showPanelInfo("bottomRight", "Climate|Civilization");
		showPanelInfo("bottomLeft", "Atmosphere|Hydrosphere|Rotation");
		this.active = true;
	}
	
	/*
	 * showPlanetName
	 * Mostra il pannello con il nome del pianeta
	 */
	function showPlanetName(name)
	{
		showDiv("planetName");
		document.getElementById("planetName").innerHTML = name;
	}
	
	/*
	 * showPanelInfo
	 * Mostra i pannelli contenenti le informazioni sui pianeti
	 */
	function showPanelInfo(panelName, sectionName)
	{
		showDiv(panelName);
		var fields = sectionName.split("|");
		var html = "";
		for (var i = 0; i < sezioni.length; i++)
		{
			if (fields.indexOf(sezioni[i].sectionName.trim()) != -1)
			{
				html += "<div id=\"header\">" + sezioni[i].sectionName + "</div>";
				html += "<div id=\"content\">";
				for (var j = 0; j < sezioni[i].info.length; j++)
					html += sezioni[i].info[j] + ": " + sezioni[i].value[j] + "<br/>";
				html += "</div>";
			}
		}
		document.getElementById(panelName).innerHTML = html;
	}
	
	/*
	 * hideAll
	 * Nasconde tutti i pannelli
	 */
	function hideAll()
	{
		hideDiv('planetName');
		hideDiv('bottomLeft');
		hideDiv('bottomRight');
		this.active = false;
	}
}