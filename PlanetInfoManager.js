/*
 * PlanetInfoManager
 * Classe che si occupa di gestire le informazioni sul pianeta selezionato a runtime
 */
PlanetInfoManager = function()
{
	this.hideDiv = hideDiv;
	this.showDiv = showDiv;
	
	this.loadInfoFromFile = loadInfoFromFile;
	this.store = store;	
	this.sezioni = [];
	
	this.show = show;
	
	this.name = "";
	
	this.showPlanetName = showPlanetName;
	
	this.hideAll = hideAll;
	
	function hideDiv(divName)
	{
		document.getElementById(divName).style.display = 'none'; 
	}
	
	function showDiv(divName)
	{
		document.getElementById(divName).style.display = 'block'; 
	}
	
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
	
	function show()
	{
		showPlanetName(name);
		showPanelInfo("bottomRight", "Climate|Civilization");
		showPanelInfo("bottomLeft", "Atmosphere|Hydrosphere|Rotation");
	}
	
	function showPlanetName(name)
	{
		showDiv("planetName");
		document.getElementById("planetName").innerHTML = name;
	}
	
	function showPanelInfo(panelName, sectionName)
	{
		showDiv(panelName);
		var fields = sectionName.split("|");
		var html = "";
		for (var i = 0; i < sezioni.length; i++)
		{
			if (fields.indexOf(sezioni[i].sectionName) != -1)
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
	
	function hideAll()
	{
		hideDiv('planetName');
		hideDiv('bottomLeft');
		hideDiv('bottomRight');
	}
}