/*
 * PlanetInfoSection
 * Salva in sezioni le informazioni sui pianeti da mostrare a schermo
 */
PlanetInfoSection = function(name)
{
	this.sectionName = name;
	this.addInfo = addInfo;
	
	this.info = [];
	this.value = [];
	
	function addInfo(row)
	{
		var fields = row.split("="); 
		this.info.push(fields[0]);
		this.value.push(fields[1]);
	}
}