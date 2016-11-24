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
	
	/*
	 * Informazioni sul pianeta
	 */
	this.name = "";
	
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
		this.name = righe[0];
		var sezione = null;
		if (this.sezioni == null)
			this.sezioni = [];
		for (var i = 1; i < righe.length; i++)
		{
			if (righe[i].startsWith("SECTION"))
			{
				if (sezione != null)
					this.sezioni.push(sezione);
				var fields = righe[i].split('=');
				sezione = new PlanetInfoSection(fields[0]);
			}
			else
				sezione.addInfo(righe[i]);
		}
	}
}